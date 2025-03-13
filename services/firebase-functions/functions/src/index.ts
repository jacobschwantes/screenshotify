import * as functions from "firebase-functions";
import * as postmark from "postmark";
import * as admin from "firebase-admin";

admin.initializeApp();

const sendPasswordResetEmail = (
  email: string | undefined,
  link: string,
  userAgent: string | undefined,
  ip: string
) => {
  const client = new postmark.ServerClient("8c116f55-fd87-4986-814b-d711186c5f21");
  client.sendEmailWithTemplate({
    From: "alerts@screenshotify.io",
    To: email,
    TemplateAlias: "password-reset",
    TemplateModel: {
      product_url: "https://screenshotify.io",
      product_name: "Screenshotify",
      action_url: link,
      support_url: "https://screenshotify.io/support",
      company_name: "Screenshotify",
      user_agent: userAgent,
      ip_address: ip,
    },
  });
};

const sendVerificationEmail = (email: string | undefined, link: string) => {
  const client = new postmark.ServerClient("8c116f55-fd87-4986-814b-d711186c5f21");
  client.sendEmailWithTemplate({
    From: "alerts@screenshotify.io",
    To: email,
    TemplateAlias: "verify-email",
    TemplateModel: {
      product_url: "https://screenshotify.io",
      product_name: "Screenshotify",
      action_url: link,
      support_url: "https://screenshotify.io/support",
      company_name: "Screenshotify",
    },
  });
};

export const beforeCreate = functions.auth.user().beforeCreate(async (user) => {
  await admin
    .firestore()
    .collection("users")
    .doc(user.uid)
    .set({
      quota: 100,
      plan: "free",
      preferences: {
        theme: "system",
        email: {
          marketing: true,
          transactional: true,
          billing: true,
        },
      },
    });
});

export const sendVerification = functions.auth.user().onCreate((user) => {
  if (user.email && !user.emailVerified) {
    return admin
      .auth()
      .generateEmailVerificationLink(user.email)
      .then((link) => {
        return sendVerificationEmail(user.email, link);
      })
      .catch((e) => console.log(e));
  }
});

export const sendNewVerificationEmail = functions.https.onCall((data, context) => {
  if (context?.auth?.uid) {
    admin
      .auth()
      .getUser(context.auth.uid)
      .then((userRecord) => {
        if (userRecord.email) {
          admin
            .auth()
            .generateEmailVerificationLink(userRecord.email)
            .then((link) => {
              return sendVerificationEmail(userRecord.email, link);
            });
        }
      });
  }
});

export const resetPassword = functions.https.onCall((data, context) => {
  try {
    if (data) {
      const { ["user-agent"]: userAgent } = context.rawRequest.headers;
      const ip = context.rawRequest.ip;
      if (data) {
        return admin
          .auth()
          .generatePasswordResetLink(data)
          .then((link) => {
            return sendPasswordResetEmail(data, link, userAgent, ip);
          })
          .catch(() => {
            throw new functions.https.HttpsError("invalid-argument", "Invalid email address.");
          });
      }
    } else if (context?.auth?.uid) {
      return admin
        .auth()
        .getUser(context.auth.uid)
        .then((userRecord) => {
          const { ["user-agent"]: userAgent } = context.rawRequest.headers;
          const ip = context.rawRequest.ip;
          if (userRecord.email) {
            admin
              .auth()
              .generatePasswordResetLink(userRecord.email)
              .then((link) => {
                return sendPasswordResetEmail(userRecord.email, link, userAgent, ip);
              });
          }
        });
    } else {
      throw new functions.https.HttpsError("invalid-argument", "Invalid email address.");
    }
  } catch (e: any) {
    throw new functions.https.HttpsError("internal", "Internal server error.");
  }
});

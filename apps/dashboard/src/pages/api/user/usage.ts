import { withAuth } from "@utils/middlewares";
import type { NextApiRequest, NextApiResponse } from "next";
import { firestore } from "@modules/auth/firebase/admin";
import { values, groupBy } from "lodash";
import { DateTime, Interval } from "luxon";
type ResData = {
  message: string;
  data?: LogData;
};
type LogData = {
  usage?: number;
  chartData?: {
    usage30day?: { x: string; y: number }[];
    usage7day?: { x: string; y: number }[];
  };
  errorCount?: number;
};
type UsageLog = {
  href: string;
  id: number;
  latency: number;
  status: string;
  timestamp: number;
  token_name: string;
  url: string;
  error: string;
};
async function getCount(docRef: FirebaseFirestore.CollectionReference) {
  const querySnapshot = await docRef.get();
  const documents = querySnapshot.docs;
  let count = 0;
  for (const doc of documents) {
    count += doc.get("count");
  }
  return count;
}
const groupData = (data: UsageLog[], zone: string) => {
  return values(
    groupBy(data, (d) =>
      DateTime.fromMillis(d.timestamp, { zone: zone }).startOf("day")
    )
  );
};
const aggregateData = (data: UsageLog[][], zone: string) => {
  let defaultData = Array.from(Array(29).keys()).map((x) => {
    const date = DateTime.now()
      .setZone(zone)
      .startOf("day")
      .minus({ days: x + 1 });
    return { x: date.toISO(), y: 0 };
  });

  data.forEach((chunk) => {
    const dateString = DateTime.fromMillis(chunk[0].timestamp, {
      zone: zone,
    })
      .startOf("day")
      .toISO();
    const idx = defaultData.findIndex((item) => item.x === dateString);
    defaultData[idx] = { x: dateString, y: chunk.length };
  });

  return defaultData.reverse();
};

const getDailyLogs = async (
  userRef: FirebaseFirestore.DocumentReference,
  zone: string
) => {
  const logsRef = userRef.collection("logs");
  const logsSnapshot = await logsRef
    .where(
      "timestamp",
      ">=",
      DateTime.now().setZone(zone).startOf("day").toMillis()
    )
    .get();

  const logs = logsSnapshot.docs.map((log) => log.data());
  const erroredLogs = logs.filter((item) => item.status === "failed");

  return { count: logs.length, errors: erroredLogs.length };
};

const runAggregation = async (
  userRef: FirebaseFirestore.DocumentReference,
  zone: string
) => {
  const logsRef = userRef.collection("logs");
  try {
    const res = await firestore.runTransaction(async (t) => {
      const logsSnapshot = await t.get(logsRef);
      const logs: UsageLog[] = [];
      logsSnapshot.docs.forEach((doc: FirebaseFirestore.DocumentData) =>
        logs.push(doc.data())
      );
      const groupedData = groupData(logs, zone);
      const aggregatedData = aggregateData(groupedData, zone);
      const count = logs.filter(
        (item) =>
          DateTime.now().setZone(zone).startOf("day").toMillis() <
          item.timestamp
      );
      const errorCount = logs.filter((item) => item.status === "failed");
      const aggregated6Day = aggregatedData.slice(-6);
      t.update(userRef, {
        errorCount: errorCount.length,
        lastAggregation: Date.now(),
        chartData: { usage6day: aggregated6Day, usage29day: aggregatedData },
      });
      const updatedData = aggregatedData.concat({
        x: DateTime.now().setZone(zone).startOf("day").toISO(),
        y: count.length,
      });
      return {
        errorCount: errorCount.length,
        chartData: {
          usage7day: updatedData.slice(-7),
          usage30day: updatedData,
        },
      };
    });
    console.log("Transaction success", res);
    return res;
  } catch (e) {
    console.log("Transaction failure:", e);
  }
};
interface ApiRequest extends NextApiRequest {
  uid: string;
  email: string;
  email_verified: boolean;
}
async function handler(req: ApiRequest, res: NextApiResponse<ResData>) {
  const userRef = firestore.collection("users").doc(req.uid);
  const doc = await userRef.get();
  const zone =
    typeof req.query.zone === "string"
      ? req.query.zone.replace("-", "/")
      : undefined;

  if (!doc.exists || !zone) {
    res.status(404).json({ message: "user does not exist" });
  } else {
    const usage: number = await getCount(userRef.collection("usage"));
    const docData = doc.data();
    const now = DateTime.now();
    const lastAggregation = docData?.lastAggregation;
    const i = lastAggregation
      ? Interval.fromDateTimes(lastAggregation, now)
      : false;
    const check = i ? i.length("day") >= 1 : true;
    if (
      DateTime.now().setZone(zone).startOf("day").toMillis() >
        lastAggregation ||
      check
    ) {
      const newAggregateData = await runAggregation(userRef, zone);
      const data = { ...docData, usage, ...newAggregateData };
      if (newAggregateData)
        res.status(200).json({ message: "usage found", data });
      else res.status(500).json({ message: "failed to aggregate data" });
    } else {
      const dailyUsage = await getDailyLogs(userRef, zone);
      const dailyData = {
        x: DateTime.now().setZone(zone).startOf("day").toISO(),
        y: dailyUsage.count,
      };

      if (docData) {
        docData.chartData = {
          usage7day: docData.chartData.usage6day.concat(dailyData),
          usage30day: docData.chartData.usage29day.concat(dailyData),
        };
        docData.errorCount += dailyUsage.errors;
      }
      const data = { ...docData, usage };
      res.status(200).json({ message: "usage found", data });
    }
  }
}
export default withAuth(handler);

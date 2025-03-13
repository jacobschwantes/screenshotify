export const isValidUrl = (url: string) => {
  try {
    new URL(url);
  } catch (_) {
    console.log("invalid url");
    return false;
  }
  return true;
};

export const matchWords = (subject: string, words: string[]) =>{
  var regex = new RegExp("\\b(?:" + words.join("|") + ")\\b", "g");
  const cleaned = subject.replace(regex, "");
  return cleaned.replace(/\./g, "_");
}
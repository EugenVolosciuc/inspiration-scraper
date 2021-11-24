import writeToConsole from "./writeToConsole";

const errorHandler = (error: unknown, websiteTitle: string) => {
  console.log("error", error);
  writeToConsole(`Could not scrape ${websiteTitle}`, 1);

  // Could not scrape website
  // TODO: Send message (sms or email) that this handler failed
  // TODO: Fire another website's handler to get an entry (not sure about this one)
};

export default errorHandler;

const errorToast = (error: any) => {
  let errorMessage: string = "";

  if (typeof error === "string") {
    errorMessage = error;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "object" && error !== null) {
    const errorObject = error as Record<string, string>;
    const errorMessagesArray = Object.values(errorObject);
    errorMessage = errorMessagesArray.join("\n");
  }

  return errorMessage;
};

export default errorToast;

const formatDate = (date: Date | string | undefined): string => {
    if (!date) return "Unknown";
    const parsedDate = typeof date === "string" ? new Date(date) : date;
    return isNaN(parsedDate.getTime()) ? "Unknown" : parsedDate.toISOString().split("T")[0];
  };

  export default formatDate;
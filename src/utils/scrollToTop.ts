export const scrollToTop = (): void =>{
    document
      .querySelector(".section-main--list-movies")
      ?.scrollIntoView({ behavior: "smooth" });
  }
export const SESSION_COOKIE_NAME = process.env.NODE_ENV === "production"
  ? "__Host-portfolio-session"
  : "portfolio-session"

export const SESSION_DURATION_IN_SECONDS = 55 * 60

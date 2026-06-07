// This layout wraps all pages inside /app/auth/*
// The AuthLayout component handles the card + logo + theme toggle

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
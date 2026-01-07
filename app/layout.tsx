// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          height: "100vh",
          width: "100vw",
          backgroundColor: "#121212",
        }}
      >
        {children}
      </body>
    </html>
  );
}

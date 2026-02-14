export const metadata = {
  title: 'AutoTouch Dashboard',
  description: 'Remote control for AutoTouch',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}

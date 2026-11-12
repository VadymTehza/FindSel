// Звичайне посилання-якір: перехід між сторінками без бібліотек маршрутизації
export default function Link({ to, children, ...props }) {
  return (
    <a href={`#${to}`} {...props}>
      {children}
    </a>
  );
}

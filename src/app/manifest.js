export default function manifest() {
  return {
    name: "Flowlist - Premium Todo",
    short_name: "Flowlist",
    description: "A premium modern serverless todo app with realtime sync.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#020617",
    orientation: "portrait",
    icons: [
      {
        src: "/file.svg",
        type: "image/svg+xml",
        sizes: "512x512",
      },
    ],
  };
}

export function ThemeScript() {
  const script = `try{var t=localStorage.getItem("w2q-theme");if(t==="light"){document.documentElement.classList.add("light")}}catch(e){}`;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}

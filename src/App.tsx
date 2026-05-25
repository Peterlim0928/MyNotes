import { ThemeProvider } from "./context/ThemeContext";
import WorkspacePage from "./pages/WorkspacePage";

function App() {
  return (
    <ThemeProvider>
      <WorkspacePage />
    </ThemeProvider>
  );
}

export default App;

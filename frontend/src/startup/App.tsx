import { BrowserRouter } from 'react-router-dom';
import { ActionSettings } from '../user_interface/screen_state/ActionSettings';
import { LanguageSettings } from '../user_interface/languages/LanguageSettings';
import { ThemeSettings } from '../user_interface/appearance/ThemeSettings';
import { SessionSettings } from '../user_interface/screen_state/SessionSettings';
import { connectParts } from './connect_parts';
import { PageRoutes } from './page_routes';

const actions = connectParts();

export function App() {
  return <ActionSettings actions={actions}><LanguageSettings><ThemeSettings><SessionSettings>
    <BrowserRouter><PageRoutes /></BrowserRouter>
  </SessionSettings></ThemeSettings></LanguageSettings></ActionSettings>;
}

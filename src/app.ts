import * as React from 'react';
import './app.less';
import 'anna-remax-ui/dist/anna.css'

wx.cloud.init()

const App: React.FC = props => props.children as React.ReactElement;

export default App;

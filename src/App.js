import React from 'react';
import DynamicForm from './components/DynamicForm';
import formJson from './form.json'; 

const App = () => {
  return <DynamicForm formJson={formJson} />;
};

export default App;

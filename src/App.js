import Form from "./Form";
import FormConfig from "./FormConfig";
import "./styles.css";

/* import FormConfig1 from "./SampleJSON/Dag.json";
import FormConfig2 from "./SampleJSON/Block&Dag.json";
import { processJSON } from "./ProcessJSON/ObjectPreProcessUtils";
const FormConfig1 = processJSON(FormConfig2);
console.log(FormConfig1); */

export default function App() {
  return (
    <div className="App">
      <Form config={FormConfig} />
    </div>
  );
}

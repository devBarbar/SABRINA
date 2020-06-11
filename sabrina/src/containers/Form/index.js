import React, { useEffect, useState, useRef, useCallback } from "react";
import { FForm, Frame } from "../../FForm";
import { Dropdown, Item } from "../../components/Dropdown";
import { format_euro, localStringToNumber } from "../../util";
import { RadioButtons, RadioButton } from "../../components/Radiobutton";
import { useAlert } from "react-alert";

import {
  Checkboxes,
  Checkbox,
  anlageklassenElement,
} from "../../components/Checkbox";
import Result from "../Result";

function Index() {
  const [anlageklassen, setAnlageklassen] = useState([]);
  const [amount, setAmount] = useState({});
  const [response, setResponse] = useState(null);
  const [investitionsdauer, setInvestitionsdauer] = useState();
  const [langeInvestitionsdauer, setLangeInvestitionsdauer] = useState();
  const höheKreditRef = useRef();
  const [Investitionsrahmen, setInvestitionsrahmen] = useState("");
  const InvestitionrahmenRef = useRef();
  const [hatKredit, setHatKredit] = useState("");
  const [Kredit, setKredit] = useState("");
  const [nutzen, setNutzen] = useState("");
  const [anlageverwalter, setAnlageverwalter] = useState("");
  const [Risikobereitschaft, setRisikobereitschaft] = useState("");
  const [anlagepräferenzen, setAnlagePräferenzen] = useState("");
  const alert = useAlert();

  useEffect(() => {
    if (investitionsdauer == "Mehr als 2 Jahre") {
      alert.show(
        "Berechnungen bei längeren Anlagedauern basieren auf Approximationen der Monatsdaten "
      );
    }
  }, [investitionsdauer]);
  const renderAmout = () => {
    const frames = [];

    let tmp = anlageklassen.map((value) => (
      <Frame
        key={value}
        id={value}
        title={`Wie hoch ist der Wert Ihrer ${value}`}
      >
        <input
          required
          value={amount[value]}
          onChange={(e) => setAmount({ ...amount, [value]: e.target.value })}
          placeholder='in €'
        ></input>
      </Frame>
    ));
    if (tmp.length > 0) {
      tmp.forEach((element) => {
        frames.push(React.cloneElement(element));
      });
      return frames;
    }
  };

  //----------------------------------------------------------------
  // INPUTS
  //----------------------------------------------------------------

  const investHandler = (e) => {
    setInvestitionsdauer(e.target.value);
  };
  const investitionsrahmenHandler = (e) => {
    setInvestitionsrahmen(e.target.value);
    InvestitionrahmenRef.current.addEventListener("keydown", function (e) {
      if (e.keyCode === 13 && isNaN(e.target.value) === false) {
        setInvestitionsrahmen(format_euro(e.target.value));
      }
    });
  };

  const höheKreditHandler = (e) => {
    setKredit(e.target.value);
    höheKreditRef.current.addEventListener("keydown", function (e) {
      if (e.keyCode === 13 && isNaN(e.target.value) === false) {
        setKredit(format_euro(e.target.value));
      }
    });
  };

  //----------------------------------------------------------------
  // RADIOBUTTONS
  //----------------------------------------------------------------

  const data = {
    investitionsdauer,
    langeInvestitionsdauer,
    Investitionsrahmen,
    hatKredit,
    Kredit: Kredit != "" && localStringToNumber(Kredit),
    nutzen,
    anlageklassen,
    amount,
    Investitionsrahmen:
      Investitionsrahmen != "" && localStringToNumber(Investitionsrahmen),
    anlageverwalter,
    Risikobereitschaft,
    anlagepräferenzen,
  };

  const submitHandler = useCallback(
    (e) => {
      e.preventDefault();
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      };
      fetch("/add_movie", requestOptions)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          /* let response_risk = JSON.parse(data["RISIKO"]); */
          setResponse(data);
        });
    },
    [data]
  );
  // NEEDED value

  return !response ? (
    <FForm title='Investitionsrechner' onSubmit={submitHandler}>
      <Frame
        dataInfo='In Jahren'
        id='test'
        title='Wie lange möchten Sie Investieren ?'
      >
        <RadioButtons
          selected={investitionsdauer}
          setSelected={setInvestitionsdauer}
          name='Investitiondauer'
          id='Investitiondauer'
        >
          <RadioButton>1 Monat</RadioButton>
          <RadioButton>1 Quartal</RadioButton>
          <RadioButton>1 Jahr</RadioButton>
          <RadioButton>2 Jahre</RadioButton>
          <RadioButton>Mehr als 2 Jahre</RadioButton>
        </RadioButtons>
      </Frame>
      <Frame
        dataInfo='In Jahren'
        id='test'
        title='Wie lange möchten Sie Investieren ?'
        show={
          investitionsdauer != "1 Monat" &&
          investitionsdauer != "1 Quartal" &&
          investitionsdauer != "1 Jahr" &&
          investitionsdauer != "2 Jahre"
        }
      >
        <input
          value={langeInvestitionsdauer}
          onChange={(e) => setLangeInvestitionsdauer(e.target.value)}
        ></input>
      </Frame>
      <Frame id='test' title='Wie hoch ist Ihr gewünschter Investitionsrahmen'>
        <input
          ref={InvestitionrahmenRef}
          value={Investitionsrahmen}
          placeholder='in €'
          onChange={investitionsrahmenHandler}
          required
        ></input>
      </Frame>
      <Frame
        id='test2'
        title='Möchten Sie zusätzlich zu Ihrem Investitionsrahmen einen Kredit aufnehmen ?'
      >
        <RadioButtons
          selected={hatKredit}
          setSelected={setHatKredit}
          name='Kredit'
          id='Kredit'
        >
          <RadioButton>Ja</RadioButton>
          <RadioButton>Nein</RadioButton>
        </RadioButtons>
      </Frame>
      {hatKredit == "Ja" && (
        <Frame
          id='test'
          title='In welcher Höhe möchsten Sie einen Kredit aufnehmen?'
        >
          <input
            ref={höheKreditRef}
            value={Kredit}
            onChange={(e) => höheKreditHandler(e)}
            placeholder='in €'
            required
          ></input>
        </Frame>
      )}
      <Frame id='test' title='Welche Anlageklassen besitzen Sie derzeit ?'>
        <Checkboxes
          active={anlageklassen}
          setActive={setAnlageklassen}
          id='asas'
        >
          <Checkbox>Aktien</Checkbox>
          <Checkbox>Immobilien</Checkbox>
          <Checkbox>Anleihen</Checkbox>
          <Checkbox>Rohstoffe</Checkbox>
          <Checkbox>Immobilienfonds</Checkbox>
          <Checkbox>Deutsche REITs</Checkbox>
          <Checkbox>Amerikanische REITs</Checkbox>
        </Checkboxes>
      </Frame>
      {/********************************
       * Immobilien
       ********************************/}
      {renderAmout()}

      <Frame
        id='Nutzen_Radio'
        title='Wie ist die derzeitige Vermietung / Nutzung der Immobilien'
        show={anlageklassen.includes("Immobilien")}
      >
        <RadioButtons
          selected={nutzen}
          setSelected={setNutzen}
          name='Nutzen'
          id='Nutzen'
        >
          <RadioButton>Gewerbliche Mieter</RadioButton>
          <RadioButton>Private Mieter</RadioButton>
          <RadioButton>Beides</RadioButton>
          <RadioButton>Nur Private Nutzung</RadioButton>
        </RadioButtons>
      </Frame>
      <Frame
        show={anlageklassen.includes("Immobilien")}
        id='test'
        title='Was sind Ihre Anlagepräferenzen?'
      >
        <RadioButtons
          selected={anlagepräferenzen}
          setSelected={setAnlagePräferenzen}
          name='Präferenz'
          id='Präferenz'
        >
          <RadioButton>Direkte Immobilienanlage</RadioButton>
          <RadioButton>Indirekte Immobilienanlage</RadioButton>
          <RadioButton>Beides</RadioButton>
        </RadioButtons>
      </Frame>

      <Frame
        show={
          anlagepräferenzen == "Direkte Immobilienanlage" ||
          anlagepräferenzen == "Beides"
        }
        id='test'
        title='Benötigen sie einen Anlageverwalter?'
      >
        <RadioButtons
          selected={anlageverwalter}
          setSelected={setAnlageverwalter}
          name='Anlageverwalter'
          id='Anlageverwalter'
        >
          <RadioButton>Ja</RadioButton>
          <RadioButton>Nein</RadioButton>
        </RadioButtons>
      </Frame>

      <Frame id='test' title='Wie Risikobereit sind sie?'>
        <RadioButtons
          selected={Risikobereitschaft}
          setSelected={setRisikobereitschaft}
          name='Risikobereitschaft'
          id='Risikobereitschaft'
        >
          <RadioButton>Niedrig</RadioButton>
          <RadioButton>Mittel</RadioButton>
          <RadioButton>Hoch</RadioButton>
        </RadioButtons>
      </Frame>
    </FForm>
  ) : (
    <Result response={response}></Result>
  );
}

export default Index;

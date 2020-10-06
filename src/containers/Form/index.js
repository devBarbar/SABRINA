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
  const [langeInvestitionsdauer, setLangeInvestitionsdauer] = useState("");
  const höheKreditRef = useRef();
  const [Investitionsrahmen, setInvestitionsrahmen] = useState("");
  const InvestitionrahmenRef = useRef();
  const [hatKredit, setHatKredit] = useState("");
  const [Kredit, setKredit] = useState("");
  const [nutzen, setNutzen] = useState("");
  const [Immobilienverwalter, setImmobilienverwalter] = useState("");
  const [Risikobereitschaft, setRisikobereitschaft] = useState("");
  const [anlagepräferenzen, setAnlagePräferenzen] = useState("");
  const thealert = useAlert();

  useEffect(() => {
    if (investitionsdauer == "Mehr als 2 Jahre") {
      thealert.show(
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
        title={`Wie hoch ist der Wert Ihrer ${value}?`}
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
  const amountAktienRef = useRef();
  const amountAktienHandler = (e) => {
    setAmount({ ...amount, ["Aktien"]: e.target.value });
    amountAktienRef.current.addEventListener("keydown", function (e) {
      if (e.keyCode === 13 && isNaN(e.target.value) === false) {
        setAmount({ ...amount, ["Aktien"]: format_euro(e.target.value) });
      }
    });
  };
  const amountImmoRef = useRef();
  const amountImmoHandler = (e) => {
    setAmount({ ...amount, ["Immobilien"]: e.target.value });
    amountImmoRef.current.addEventListener("keydown", function (e) {
      if (e.keyCode === 13 && isNaN(e.target.value) === false) {
        setAmount({ ...amount, ["Immobilien"]: format_euro(e.target.value) });
      }
    });
  };
  const amountAnleihenRef = useRef();
  const amountAnleihenHandler = (e) => {
    setAmount({ ...amount, ["Anleihen"]: e.target.value });
    amountAnleihenRef.current.addEventListener("keydown", function (e) {
      if (e.keyCode === 13 && isNaN(e.target.value) === false) {
        setAmount({ ...amount, ["Anleihen"]: format_euro(e.target.value) });
      }
    });
  };
  const amountRohstoffeRef = useRef();
  const amountRohstoffeHandler = (e) => {
    setAmount({ ...amount, ["Rohstoffe"]: e.target.value });
    amountRohstoffeRef.current.addEventListener("keydown", function (e) {
      if (e.keyCode === 13 && isNaN(e.target.value) === false) {
        setAmount({ ...amount, ["Rohstoffe"]: format_euro(e.target.value) });
      }
    });
  };
  const amountImmobilienfondsRef = useRef();
  const amountImmobilienfondsHandler = (e) => {
    setAmount({ ...amount, ["Immobilienfonds"]: e.target.value });
    amountImmobilienfondsRef.current.addEventListener("keydown", function (e) {
      if (e.keyCode === 13 && isNaN(e.target.value) === false) {
        setAmount({
          ...amount,
          ["Immobilienfonds"]: format_euro(e.target.value),
        });
      }
    });
  };
  const amountDeutscheReitsRef = useRef();
  const amountDeutscheReitsHandler = (e) => {
    setAmount({ ...amount, ["Deutsche REITs"]: e.target.value });
    amountDeutscheReitsRef.current.addEventListener("keydown", function (e) {
      if (e.keyCode === 13 && isNaN(e.target.value) === false) {
        setAmount({
          ...amount,
          ["Deutsche REITs"]: format_euro(e.target.value),
        });
      }
    });
  };
  const amountAmerikanischeReitsRef = useRef();
  const amountAmerikanischeReitsHandler = (e) => {
    setAmount({ ...amount, ["Amerikanische REITs"]: e.target.value });
    amountAmerikanischeReitsRef.current.addEventListener("keydown", function (
      e
    ) {
      if (e.keyCode === 13 && isNaN(e.target.value) === false) {
        setAmount({
          ...amount,
          ["Amerikanische REITs"]: format_euro(e.target.value),
        });
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
    Immobilienverwalter,
    Risikobereitschaft,
    anlagepräferenzen,
  };

  const submitHandler = useCallback(
    (e) => {
      let key_amount = Object.keys(amount);
      let val_amount = Object.values(amount);

      for (let key of key_amount) {
        console.log(key);
        console.log(amount[key]);
        amount[key] = localStringToNumber(amount[key]);
      }
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
        title='Wie lange möchten Sie investieren ?'
      >
        <RadioButtons
          selected={investitionsdauer}
          setSelected={setInvestitionsdauer}
          name='Investitiondauer'
          id='Investitiondauer'
          required={true}
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
          placeholder='in Jahren '
          required
          onChange={(e) => setLangeInvestitionsdauer(e.target.value)}
        ></input>
      </Frame>
      <Frame
        dataInfo='Hier bitte gewünschtes Eigenkapital in Euro angeben'
        id='test'
        title='Wie hoch ist Ihr gewünschter Investitionsrahmen ?'
      >
        <input
          ref={InvestitionrahmenRef}
          value={Investitionsrahmen}
          placeholder='in Euro'
          onChange={investitionsrahmenHandler}
          required
        ></input>
      </Frame>
      <Frame
        id='test2'
        dataInfo='Durch Hinzunahmne eines Kredits erhöht sich der Gesamtinvestitionsrahmen'
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
          dataInfo='in Euro'
          id='test'
          title='In welcher Höhe möchsten Sie einen Kredit aufnehmen?'
        >
          <input
            ref={höheKreditRef}
            value={Kredit}
            onChange={(e) => höheKreditHandler(e)}
            placeholder='in Euro'
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
      <Frame
        key={"Aktien"}
        id={"Aktien"}
        dataInfo='in Euro'
        title={`Wie hoch ist der Wert Ihrer Aktien?`}
        show={anlageklassen.includes("Aktien")}
      >
        <input
          classname='asset--amount'
          ref={amountAktienRef}
          required
          value={amount["Aktien"]}
          onChange={amountAktienHandler}
          placeholder='in Euro'
        ></input>
      </Frame>
      <Frame
        dataInfo='in Euro'
        key={"Immobilien"}
        id={"Immobilien"}
        title={`Wie hoch ist der Wert Ihrer Immobilien?`}
        show={anlageklassen.includes("Immobilien")}
      >
        <input
          required
          classname='asset--amount'
          value={amount["Immobilien"]}
          onChange={amountImmoHandler}
          ref={amountImmoRef}
          placeholder='in Euro'
        ></input>
      </Frame>
      <Frame
        dataInfo='in Euro'
        key={"Anleihen"}
        id={"Anleihen"}
        title={`Wie hoch ist der Wert Ihrer Anleihen?`}
        show={anlageklassen.includes("Anleihen")}
      >
        <input
          ref={amountAnleihenRef}
          required
          classname='asset--amount'
          value={amount["Anleihen"]}
          onChange={amountAnleihenHandler}
          placeholder='in Euro'
        ></input>
      </Frame>
      <Frame
        dataInfo='in Euro'
        key={"Rohstoffe"}
        id={"Rohstoffe"}
        title={`Wie hoch ist der Wert Ihrer Rohstoffe?`}
        show={anlageklassen.includes("Rohstoffe")}
      >
        <input
          ref={amountRohstoffeRef}
          required
          classname='asset--amount'
          value={amount["Rohstoffe"]}
          onChange={amountRohstoffeHandler}
          placeholder='in Euro'
        ></input>
      </Frame>
      <Frame
        dataInfo='in Euro'
        key={"Immobilienfonds"}
        id={"Immobilienfonds"}
        title={`Wie hoch ist der Wert Ihrer Immobilienfonds?`}
        show={anlageklassen.includes("Immobilienfonds")}
      >
        <input
          ref={amountImmobilienfondsRef}
          required
          classname='asset--amount'
          value={amount["Immobilienfonds"]}
          onChange={amountImmobilienfondsHandler}
          placeholder='in Euro'
        ></input>
      </Frame>
      <Frame
        dataInfo='in Euro'
        key={"Deutschen REITs"}
        id={"Deutschen REITs"}
        title={`Wie hoch ist der Wert Ihrer Deutschen REITs?`}
        show={anlageklassen.includes("Deutsche REITs")}
      >
        <input
          ref={amountDeutscheReitsRef}
          required
          classname='asset--amount'
          value={amount["Deutsche REITs"]}
          onChange={amountDeutscheReitsHandler}
          placeholder='in Euro'
        ></input>
      </Frame>
      <Frame
        dataInfo='in Euro'
        key={"Amerikanischen REITs"}
        id={"Amerikanischen REITs"}
        title={`Wie hoch ist der Wert Ihrer Amerikanischen REITs?`}
        show={anlageklassen.includes("Amerikanische REITs")}
      >
        <input
          ref={amountAmerikanischeReitsRef}
          required
          classname='asset--amount'
          value={amount["Amerikanische REITs"]}
          onChange={amountAmerikanischeReitsHandler}
          placeholder='in Euro'
        ></input>
      </Frame>

      <Frame
        id='Nutzen_Radio'
        title='Wie ist die derzeitige Vermietung / Nutzung der Immobilien?'
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
        show={langeInvestitionsdauer === ""}
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
        show={langeInvestitionsdauer !== ""}
        id='test'
        title='Was sind Ihre Anlagepräferenzen?'
      >
        <RadioButtons
          selected={anlagepräferenzen}
          setSelected={setAnlagePräferenzen}
          name='Präferenz'
          id='Präferenz'
        >
          <RadioButton>Indirekte Immobilienanlage</RadioButton>
          <RadioButton value='Beides'>
            Direkte & Indirekte Immobilienanlage
          </RadioButton>
        </RadioButtons>
      </Frame>

      <Frame
        show={
          anlagepräferenzen == "Direkte Immobilienanlage" ||
          anlagepräferenzen == "Beides"
        }
        id='test'
        title='Benötigen Sie einen Immobilienverwalter?'
      >
        <RadioButtons
          selected={Immobilienverwalter}
          setSelected={setImmobilienverwalter}
          name='Immobilienverwalter'
          id='Immobilienverwalter'
        >
          <RadioButton>Ja</RadioButton>
          <RadioButton>Nein</RadioButton>
        </RadioButtons>
      </Frame>

      <Frame id='test' title='Wie Risikobereit sind Sie?'>
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

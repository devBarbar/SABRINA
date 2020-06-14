import React, { useEffect, useState, useRef, useCallback } from "react";
import { FForm, Frame } from "../../FForm";
import { Defs, linearGradientDef } from "@nivo/core";
import { ResponsiveLine } from "@nivo/line";
import { Theme } from "@nivo/core";
import Layout from "../../components/Layout";
import styled from "styled-components";
import { format_euro } from "../../util";

const Title = styled.label`
  && {
    display: inline-block;
    padding: 0 5px 1em 0;
    font-weight: 700;
    pointer-events: none;
  }
`;

const Info = styled.h4`
  & {
    position: relative;
  }
  &::before {
    position: absolute;
    bottom: 100%;
    left: 21.5%;
    padding: 0 0 10px;
    min-width: 200px;
    content: attr(data-info);
    font-size: 0.4em;
    color: #6a7b7e;
    opacity: 0;
    -webkit-transition: opacity 0.3s, -webkit-transform 0.3s;
    transition: opacity 0.3s, transform 0.3s;
    -webkit-transform: translate3d(0, -5px, 0);
    transform: translate3d(0, -5px, 0);
    pointer-events: none;
  }

  &:hover::before {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }

  &::after {
    position: relative;
    display: inline-block;
    margin-left: 10px;
    width: 24px;
    height: 24px;
    border: 2px solid rgba(0, 0, 0, 0.4);
    color: rgba(0, 0, 0, 0.4);
    border-radius: 50%;
    content: "i";
    vertical-align: top;
    text-align: center;
    font-weight: 700;
    font-style: italic;
    font-size: 14px;
    font-family: Georgia, serif;
    line-height: 20px;
    cursor: pointer;
    pointer-events: auto;
  }
`;

function Result({ response }) {
  const [Risk, setRisk] = useState(null); // x
  const [Return, setReturn] = useState(null); //y
  const [data, setData] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [userRisiko, setUserRisiko] = useState(null);
  const [userRendite, setUserRendite] = useState(null);
  const [selected, setSelected] = useState(false);
  const [userData, setUserData] = useState(false);
  useEffect(() => {
    let data = JSON.parse(response["DATA"]);
    let asJson = data;
    let user_data = JSON.parse(response["USER_DATA"]);
    let tmp_portfolio = [];
    setUserRisiko(user_data["RISIKO"]);
    setUserData(user_data);
    console.log(user_data);
    let Portfolios = Object.keys(asJson);

    const keys = Object.keys(asJson["Aktien"]);
    for (const key of keys) {
      let tmp_dict = {};
      for (const Asset of Portfolios) {
        if (Asset !== "Return" && Asset !== "Risk") {
          let vals = Object.values(asJson[Asset]);
          tmp_dict[Asset] = vals[key];
        }
      }
      tmp_portfolio.push(tmp_dict);
    }

    setRisk(asJson["Risk"]);
    setReturn(asJson["Return"]);
    setPortfolio(tmp_portfolio);
  }, [response]);

  useEffect(() => {
    if (Risk && Return) {
      const keys_risk = Object.keys(Risk); // x
      const keys_return = Object.keys(Return); // y
      const values_risk = Object.values(Risk);
      const values_return = Object.values(Return);
      let low = [];
      let medium = [];
      let high = [];

      for (const key of keys_risk) {
        let x = values_risk[key];
        let y = values_return[key];
        if (key < 7) {
          low.push({ x: x, y: y });

          if (userRisiko != "Mittel" && key == 6) {
            medium.push({ x: x, y: y });
          }
        } else if (key >= 7 && key < 14) {
          if (key == 7 && userRisiko == "Mittel") {
            low.push({ x: x, y: y });
          }
          medium.push({ x: x, y: y });
          if (key == 13 && userRisiko != "Hoch") {
            high.push({ x: x, y: y });
          }
        } else {
          if (key == 14 && userRisiko == "Hoch") {
            medium.push({ x: x, y: y });
          }
          high.push({ x: x, y: y });
        }
      }
      let low_data = {
        id: "Niedriges Risiko",
        color: "hsl(236, 70%, 50%)",
        data: low,
      };
      let medium_data = {
        id: "Mittleres Risiko",
        color: "hsl(236, 70%, 50%)",
        data: medium,
      };
      let high_data = {
        id: "Hohes Risiko",
        color: "hsl(236, 70%, 50%)",
        data: high,
      };
      setData([low_data, medium_data, high_data]);
    }
  }, [Risk, Return]);

  const handlePointClick = (e) => {
    console.log(e);
    console.log(data);
    if (
      (e.index < 7 && userRisiko == "Niedrig") ||
      (e.index > 7 && e.index < 15 && userRisiko == "Mittel") ||
      (e.index > 15 && userRisiko == "Hoch")
    ) {
      let selected_index =
        userRisiko == "Mittel"
          ? e.index - 1
          : userRisiko == "Hoch"
          ? e.index - 2
          : e.index;
      setSelected({
        INDEX: selected_index,
        RISIKO: e.data.x,
        RENDITE: e.data.y,
      });
    }
  };

  const renderTooltip = (props) => {
    let index = props.point.index;
    if (
      (index < 7 && userRisiko == "Niedrig") ||
      (index > 7 && index < 15 && userRisiko == "Mittel") ||
      (index > 15 && userRisiko == "Hoch")
    ) {
      return (
        <div
          style={{
            background: "white",
            color: props.point.borderColor,
            padding: "9px 12px",
          }}
        >
          <div>
            <strong>Risiko:</strong> {"  "}
            {props.point.data.x}, <strong>Rendite:</strong>
            {"  "}
            {props.point.data.y}%
          </div>
        </div>
      );
    } else {
      return null;
    }
  };
  const format = (v) => `${v}%`;
  return (
    <Layout title='Investitionsrechner'>
      <Title className='fs-field-label'>Ihr Ergebnis </Title>
      <div style={{ height: "500px" }}>
        {data &&
          selected === false &&
          (!isNaN(userData["INVESTITIONSDAUER"]) ? (
            <Info
              data-info={
                "Die angezeigten Risiken & Renditen gelten nicht für den gesamten Anlagezeitraum"
              }
              style={{ textAlign: "center" }}
            >
              Wählen Sie Ihr gewünschtes Rendite/Risiko Verhältnis
            </Info>
          ) : (
            <Info style={{ textAlign: "center" }}>
              Wählen Sie Ihr gewünschtes Rendite/Risiko Verhältnis
            </Info>
          ))}
        {data && selected === false ? (
          <ResponsiveLine
            theme={{
              textColor: "#111",
              crosshair: { line: { strokeWidth: 3 } },
              axis: {
                ticks: {
                  text: {
                    fontSize: "1rem",
                  },
                },
              },
            }}
            linewidth={20}
            data={data}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            labelFormat={format}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: "auto",
              max: "auto",
              stacked: false,
              reverse: false,
            }}
            yFormat={".2%"}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              orient: "bottom",
              tickSize: 5,
              colors: "white",
              tickPadding: 5,
              tickRotation: 0,
              legend: "Risiko",
              legendOffset: 36,
              legendPosition: "middle",
            }}
            axisLeft={{
              orient: "left",
              tickSize: 5,
              format: format,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Rendite",
              legendOffset: 20,
              fontSize: "1rem",
              legendPosition: "middle",
            }}
            colors={[
              userRisiko == "Niedrig" ? "#01FF70" : "#AAAAAA",
              userRisiko == "Mittel" ? "#FF851B" : "#AAAAAA",
              userRisiko == "Hoch" ? "#FF4136" : "#AAAAAA",
            ]}
            pointSize={10}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabel='y'
            pointLabelYOffset={-12}
            onClick={(e) => handlePointClick(e)}
            enableArea={true}
            tooltip={(props) => renderTooltip(props)}
            tooltipFormat={format}
            useMesh={true}
            defs={[
              linearGradientDef("Niedrig", [
                {
                  offset: 0,
                  color: userRisiko == "Niedrig" ? "#01FF70" : "#AAAAAA",
                  opacity: 1,
                },
                {
                  offset: 80,
                  color: userRisiko == "Niedrig" ? "#01FF70" : "#AAAAAA",
                  opacity: 0,
                },
              ]),
              linearGradientDef("Mittel", [
                {
                  offset: 0,
                  color: userRisiko == "Mittel" ? "#FF851B" : "#AAAAAA",
                  opacity: 1,
                },
                {
                  offset: 80,
                  color: userRisiko == "Mittel" ? "#FF851B" : "#AAAAAA",
                  opacity: 0,
                },
              ]),
              linearGradientDef("Hoch", [
                {
                  offset: 0,
                  color: userRisiko == "Hoch" ? "#FF4136" : "#AAAAAA",
                  opacity: 1,
                },
                {
                  offset: 80,
                  color: userRisiko == "Hoch" ? "#FF4136" : "#AAAAAA",
                  opacity: 0,
                },
              ]),
            ]}
            fill={[
              { match: (e) => e.id === "Niedriges Risiko", id: "Niedrig" },
              { match: (e) => e.id === "Mittleres Risiko", id: "Mittel" },
              { match: (e) => e.id === "Hohes Risiko", id: "Hoch" },
            ]}
            legends={[
              {
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                translateX: 90,
                translateY: 0,
                itemsSpacing: 60,
                itemDirection: "left-to-right",
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemBackground: "rgba(0, 0, 0, .03)",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />
        ) : (
          <SelectedPortfolio
            portfolio={portfolio}
            selected={selected}
            userData={userData}
          ></SelectedPortfolio>
        )}
      </div>
    </Layout>
  );
}

export default Result;
const Table = styled.div`
  & {
    margin: 0 0 40px 0;
    width: 100%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    display: table;
    @media screen and (max-width: 580px) {
      display: block;
    }

    .row {
      display: table-row;
      background: #f6f6f6;

      &:nth-of-type(odd) {
        background: #e9e9e9;
      }

      &.header {
        font-weight: 900;
        color: #ffffff;
        background: #ea6153;

        &.Niedrig {
          background: #01ff70;
        }
        &.Mittel {
          background: #ff851b;
        }
        &.Hoch {
          background: #ff4136;
        }
      }

      @media screen and (max-width: 580px) {
        padding: 14px 0 7px;
        display: block;

        &.header {
          padding: 0;
          height: 6px;

          .cell {
            display: none;
          }
        }
        .cell {
          margin-bottom: 10px;
        }
      }
    }

    .cell {
      padding: 6px 12px;
      display: table-cell;
      color: black;
      @media screen and (max-width: 580px) {
        padding: 2px 16px;
        display: block;
      }
    }
  }
`;
const SelectedPortfolio = ({ portfolio, selected, userData }) => {
  const [formatted, setFormatted] = useState(false);
  const [version, setVersion] = useState(false);
  const formatCurrentPortfolio = () => {
    let current_portfolio = JSON.parse(userData["ANLAGEKLASSEN_AMOUNT"]);

    let total_invested_amount = 0;
    for (let key of Object.keys(current_portfolio)) {
      total_invested_amount += parseFloat(current_portfolio[key]);
    }
    total_invested_amount += parseFloat(userData.INVESTITIONSRAHMEN);
    current_portfolio["Investitionsrahmen"] = parseFloat(
      userData.INVESTITIONSRAHMEN
    );
    if (userData.KREDIT) {
      total_invested_amount += parseFloat(userData.KREDIT);
      current_portfolio["Investitionsrahmen"] += parseFloat(userData.KREDIT);
    }
    for (let key of Object.keys(current_portfolio)) {
      current_portfolio[key] =
        parseFloat(current_portfolio[key]) / parseFloat(total_invested_amount);
    }

    return current_portfolio;
  };

  const formatDifferencePortfolio = (current_portfolio, optimal_portfolio) => {
    console.log("current", current_portfolio);
    console.log("optimal", portfolio[selected.INDEX]);

    //optimal portfolio
    let current_portfolio__keys = Object.keys(current_portfolio);
    let optimal_portfolio__keys = Object.keys(optimal_portfolio);
    let all_keys = current_portfolio__keys.concat(
      optimal_portfolio__keys.filter(
        (key) => current_portfolio__keys.indexOf(key) < 0
      )
    );
    console.log(all_keys);
    let difference_portfolio = {};
    for (const key of all_keys) {
      if (key == "Investitionsrahmen") {
        continue;
      }
      let current_val = current_portfolio[key];
      let optimal_val = optimal_portfolio[key];
      let notInPortfolio =
        current_portfolio__keys.indexOf(key) === -1 &&
        optimal_portfolio__keys.indexOf(key) !== -1;
      let notOptimal =
        current_portfolio__keys.indexOf(key) !== -1 &&
        optimal_portfolio__keys.indexOf(key) === -1;

      if (notInPortfolio) {
        difference_portfolio[key] = parseFloat(optimal_val);
      } else if (notOptimal) {
        difference_portfolio[key] = parseFloat(current_val) * -1;
      } else {
        difference_portfolio[key] =
          parseFloat(optimal_val) - parseFloat(current_val);
      }
    }
    console.log(difference_portfolio);
    return difference_portfolio;
  };

  const formatOptimalPortfolio = () => {
    console.log(selected.INDEX);
    console.log(portfolio);
    let optimal_portfolio = portfolio[selected.INDEX];
    console.log(optimal_portfolio);
    let tmp = {};
    for (const key of Object.keys(optimal_portfolio)) {
      if (optimal_portfolio[key] != 0) {
        tmp[key] = optimal_portfolio[key];
      }
    }
    return tmp;
  };
  useEffect(() => {
    if (portfolio && selected && userData) {
      // derzeitiges Portfolio formattiere
      const nicht_nur_immo_und_laenger_als_2_jahre =
        !isNaN(userData.INVESTITIONSDAUER) &&
        (userData.ANLAGEPRÄFERENZ == "indirekt" ||
          userData.ANLAGEPRÄFERENZ == "Beides");
      console.group("TT");
      console.log(userData.INVESTITIONSDAUER);
      console.log(userData.ANLAGEPRÄFERENZ);
      console.log(nicht_nur_immo_und_laenger_als_2_jahre);
      setVersion(nicht_nur_immo_und_laenger_als_2_jahre);
      console.groupEnd();
      console.log("userData: ", userData);
      let optimal_portfolio = formatOptimalPortfolio();
      let current_portfolio = formatCurrentPortfolio();
      let difference_portfolio = formatDifferencePortfolio(
        current_portfolio,
        optimal_portfolio
      );
      const investitionsdauer = parseFloat(userData.INVESTITIONSDAUER);
      if (investitionsdauer > 2) {
        const risiko_monat =
          parseFloat(selected.RISIKO) /
          Math.sqrt(parseFloat(userData.INVESTITIONSDAUER) * 12);
      }

      let current_portfolio__EUR = JSON.parse(userData["ANLAGEKLASSEN_AMOUNT"]);

      let total_invested_amount = 0;
      for (let key of Object.keys(current_portfolio__EUR)) {
        total_invested_amount += parseFloat(current_portfolio__EUR[key]);
      }
      total_invested_amount += userData.INVESTITIONSRAHMEN;

      if (userData.KREDIT) {
        total_invested_amount += userData.KREDIT;
      }

      let RISIKO_MONAT =
        parseFloat(selected.RISIKO) /
        Math.sqrt(parseFloat(userData.INVESTITIONSDAUER) * 12);
      RISIKO_MONAT = RISIKO_MONAT / 100;
      let RENDITE_MONAT =
        selected.RENDITE / (parseFloat(userData.INVESTITIONSDAUER) * 12);
      RENDITE_MONAT = RENDITE_MONAT / 100;

      let RISIKO_APPROX =
        parseFloat(selected.RISIKO) *
        Math.sqrt(parseFloat(userData.INVESTITIONSDAUER) * 12);
      RISIKO_APPROX = RISIKO_APPROX / 100;

      let RENDITE_APPROX =
        parseFloat(selected.RENDITE) *
        12 *
        parseFloat(userData.INVESTITIONSDAUER);
      RENDITE_APPROX = RENDITE_APPROX / 100;
      setFormatted({
        RISIKO: `${selected.RISIKO}`,
        RENDITE: `${selected.RENDITE}%`,
        INVESTITIONSDAUER_JAHR: `${parseFloat(userData.INVESTITIONSDAUER)}`,
        INVESTITIONSDAUER_MONAT: `${
          parseFloat(userData.INVESTITIONSDAUER) * 12
        }`,
        RISIKO_MONAT: RISIKO_MONAT.toLocaleString("de", {
          style: "percent",
          minimumFractionDigits: 2,
        }),
        RENDITE_MONAT: RENDITE_MONAT.toLocaleString("de", {
          style: "percent",
          minimumFractionDigits: 2,
        }),
        PORTFOLIO: optimal_portfolio,
        CURRENT_PORTFOLIO: current_portfolio,
        DIFFERENCE_PORTFOLIO: difference_portfolio,
        TOTAL_INVESTED: total_invested_amount,
        RENDITE_APPROX: RENDITE_APPROX.toLocaleString("de", {
          style: "percent",
          minimumFractionDigits: 2,
        }),
        RISIKO_APPROX: RISIKO_APPROX.toLocaleString("de", {
          style: "percent",
          minimumFractionDigits: 2,
        }),
      });
    }
  }, [userData, selected, portfolio]);

  const renderTable = (td) => {
    if (td && selected && userData) {
      let keys = Object.keys(td);
      let values = Object.values(td);
      return (
        <Table>
          <div className={`row header ${userData.USER_RISIKO}`}>
            {keys.map((val, i) => {
              return (
                <div className='cell' key={val}>
                  {val == "Investitionsrahmen"
                    ? "Verfügbarer Investitionsrahmen"
                    : val}
                </div>
              );
            })}
          </div>
          <div className='row'>
            {" "}
            {values.map((val, i) => {
              return (
                <div className='cell' key={i}>
                  {val.toLocaleString("de", {
                    style: "percent",
                    minimumFractionDigits: 2,
                  })}
                </div>
              );
            })}
          </div>
        </Table>
      );
    }
  };
  const renderDifference = (td) => {
    if (td && selected && userData) {
      let keys = Object.keys(td);
      let values = Object.values(td);
      return (
        <Table>
          <div className={`row header ${userData.USER_RISIKO}`}>
            {keys.map((val, i) => {
              return (
                <div className='cell' key={val}>
                  {val}
                </div>
              );
            })}
          </div>
          <div className='row'>
            {" "}
            {values.map((val, i) => {
              let action = "verkaufen: ";
              if (val > 0) {
                action = "kaufen: ";
              } else {
                val = val * -1;
              }
              return (
                <div className='cell' key={i}>
                  {action}
                  {val.toLocaleString("de", {
                    style: "percent",
                    minimumFractionDigits: 2,
                  })}
                </div>
              );
            })}
          </div>
          <div className='row'>
            {values.map((val, i) => {
              return (
                <>
                  <div
                    style={{
                      color: val > 0 ? "#01ff70" : "#ff4136",
                      fontWeight: "bold",
                    }}
                    className='cell'
                    key={i}
                  >
                    {format_euro(formatted.TOTAL_INVESTED * val)}
                  </div>
                </>
              );
            })}
          </div>
        </Table>
      );
    }
  };
  /*  const renderCurrent = () => {
    if (formatted.)
  } */

  return (
    <div style={{ fontSize: "1.75rem", marginBottom: "2rem" }}>
      <p>Sehr geehrter Investor,</p>
      <p>
        Sie habe sich für eine Rendite i. H. v. {formatted.RENDITE} mit einem
        Risiko von {formatted.RISIKO} entschieden. Diese Rendite und dieses
        Risiko wurde durch Ihre Anlagepräferenzen und Ihrer gewünschten
        Haltedauer von {formatted.INVESTITIONSDAUER_JAHR} Jahren ermittelt.
        {version
          ? " Diese Daten stellen die monatliche Rendite und das monatliche Risiko dar."
          : " Diese Daten beziehen sich auf die gesamte Anlegedauer Ihrer Anlagen."}
      </p>
      <p>
        {version
          ? "Um hiervon ein besseres Bild zu bekommen, wurden hier für Sie die Rendite und das Risiko auf die gesamte Anlagedauer approximiert. "
          : "Um hiervon ein besseres Bild zu bekommen, wurde hier für Sie die Rendite und das Risiko auf Monatsdaten approximiert. "}
        Diese sind jedoch nicht explizit genau sondern nur eine grobe Angabe.
        <br />{" "}
        {version
          ? "Ungefähres Risiko der gesamten Anlagedauer: " +
            formatted.RISIKO_APPROX
          : "Ungefähres Risiko pro Monat: " + formatted.RISIKO_MONAT}{" "}
        {} <br />{" "}
        {version
          ? "Ungefähre Rendite der gesamten Anlagedauer: " +
            formatted.RENDITE_APPROX
          : "Ungefähre Rendite pro Monat: " + formatted.RENDITE_MONAT}
      </p>
      <p>
        Zur Erreichung dieses Risikos und dieser Rendite müssen ihre
        Portfolioanteile wie folgt ausgestaltet werden:
        <br />
      </p>
      {renderTable(formatted.PORTFOLIO)}
      {userData.ANLAGEKLASSEN && userData.ANLAGEKLASSEN.length > 0 && (
        <p>
          Derzeit umfasst Ihr bestehendes Portfolio folgende Anteile Ihrer
          Anlageklassen:
        </p>
      )}
      {userData.ANLAGEKLASSEN &&
        userData.ANLAGEKLASSEN.length > 0 &&
        renderTable(formatted.CURRENT_PORTFOLIO)}
      {userData.ANLAGEKLASSEN && userData.ANLAGEKLASSEN.length > 0 && (
        <p>
          Um Ihr derzeitiges Portfolio an das gewünschte anzupassen müssen Sie
          folglich diese Veränderungen vornehmen:
        </p>
      )}
      {userData.ANLAGEKLASSEN &&
        userData.ANLAGEKLASSEN.length > 0 &&
        renderDifference(formatted.DIFFERENCE_PORTFOLIO)}
      {userData.KREDIT && (
        <p>
          Da Sie sich dafür entschieden haben zu ihrer Investition einen Kredit
          hinzuzuziehen, muss Ihnen bewusst sein, dass Ihre Rendite durch die
          laufenden Tilgungen und Zinszahlungen des Kredits verringert wird.
        </p>
      )}
      {(userData.ANLAGEPRÄFERENZEN == "Direkte Immobilienanlage" ||
        userData.ANLAGEPRÄFERENZEN == "Beides") &&
        userData.NUTZEN == "Gewerbliche Mieter" && (
          <p>
            Auf Grund dessen, dass Sie derzeit eine oder mehrere Immobilien
            besitzen, die gewerblich vermietet sind, wird Ihnen empfohlen, dass
            Sie bei Ihrer nächsten Immobilieninvestition eine Immobilie mit
            privaten Mietern kaufen. Dies sollten Sie tun, um das Klumpenrisko
            Ihrer Immobilien zu verringern und um innerhalb Ihrer
            Immobilienanlagen zu diversifizieren. èDiese Antwort nur, wenn
            Investor angegeben hat, dass er nur gewerblich vermietete Immobilien
            besitzt und wenn er bei seinen Anlagepräferenzen eine Möglichkeit
            ausgewählt hat, die Immobilien als Direktanlage beinhaltet
          </p>
        )}
      {(userData.ANLAGEPRÄFERENZ == "Direkte Immobilienanlage" ||
        userData.ANLAGEPRÄFERENZ == "Beides") &&
        userData.NUTZEN == "Private Mieter" && (
          <p>
            Auf Grund dessen, dass Sie derzeit eine oder mehrere Immobilien
            besitzen, die an private Mieter vermietet sind, wird Ihnen
            empfohlen, dass Sie bei Ihrer nächsten Immobilieninvestition eine
            Immobilie mit gewerblichen Mietern kaufen. Dies sollten Sie tun, um
            das Klumpenrisko Ihrer Immobilien zu verringern und um innerhalb
            Ihrer Immobilienanlagen zu diversifizieren.
          </p>
        )}
      {(userData.ANLAGEPRÄFERENZ == "Direkte Immobilienanlage" ||
        userData.ANLAGEPRÄFERENZ == "Beides") &&
        userData.NUTZEN == "Beides" && (
          <p>
            Auf Grund dessen, dass Sie derzeit Immobilien mit gewerblichen und
            privaten Mietern besitzen haben Sie gut vorgesorgt, um einem
            Klumpenrisiko entgegenzuwirken. Bei Ihrer nächsten
            Immobilieninvestition können Sie also nach Belieben entscheiden, ob
            Sie gewerbliche oder private Mieter bevorzugen. Um jedoch das
            Klumpenrisiko noch weiter zu senken, können Sie beispielsweise in
            eine Immobilie an einem anderen Standort investieren. Außerdem
            können sie verschiedene Mietlaufzeiten in den Mietverträgen
            vereinbaren, wodurch auch das Risiko gesenkt werden kann.
          </p>
        )}
      {(userData.ANLAGEPRÄFERENZ == "Direkte Immobilienanlage" ||
        userData.ANLAGEPRÄFERENZ == "Beides") &&
        !userData.ANLAGEKLASSEN.includes("Immobilien") && (
          <p>
            Auf Grund dessen, dass Sie derzeit keine Immobilien in Ihrem
            Portfolio halten, können Sie nach Belieben entscheiden, ob Sie eine
            Immobilie mit gewerblichen oder privaten Mietern erwerben. Um jedoch
            das Klumpenrisiko zu senken, können sie beispielsweise verschiedene
            Mietlaufzeiten mit den Mietern vereinbaren.
          </p>
        )}
      {userData.IMMOBILIENVERWALTER == "Nein"
        ? "Da Sie Ihre Immobilie selbst Verwalten möchten, muss Ihnen bewusst sein, dass dies sehr aufwendig sein kann und dabei auch unternehmerisches Handeln eine Rolle spielt. Die Verwaltung einer Immobilie ist sehr Zeitintensiv und benötigt einige Vorkenntnisse. Wenn Sie Erfahrung haben und gerne unternehmerisch Handeln, ist eine eigene Verwaltung eine gute Entscheidung für Sie. Haben Sie jedoch wenig Zeit, sowie wenig Vorkenntnisse, wäre es besser, die Verwaltung an einen Experten abzugeben. Dazu stehen Deutschlandweit zahlreiche klein und groß Firmen zur Verfügung. Hierbei muss Ihnen jedoch bewusst sein, dass die Rendite durch die Kosten des Immobilienverwalters verringert wird."
        : "Sie möchten Ihre Immobilie lieber von einem Experten Verwalten lassen? Deutschlandweit stehen zahlreiche klein und groß Firmen zur Verfügung. Hierbei muss Ihnen jedoch bewusst sein, dass die Rendite durch die Kosten des Immobilienverwalters verringert wird."}
      <br></br>
      <br></br>
      <i>
        Vielen Danke für die Verwendung dieses Online-Tools. Die gesamten Daten
        beruhen auf historischen Berechnungen und stellen somit keine 100%
        zuverlässige Vorhersagen für die Zukunft dar.
      </i>
      <br></br>
      <br></br>
    </div>
  );
};

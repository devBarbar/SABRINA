from flask import Blueprint, jsonify, request, json
import pandas as pd
import matplotlib.pyplot as plt

main = Blueprint("main", __name__)

@main.route('/')
def index():
    return main.send_static_file('index.html')

@main.route("/add_movie", methods=["POST"])
def add_movie():
    data = request.get_json()
    investitionsdauer = data["investitionsdauer"]
    if investitionsdauer == "1 Monat" or investitionsdauer == "Mehr als 2 Jahre":
        xlsFile = "Monate"
        if investitionsdauer == "Mehr als 2 Jahre":
            data["investitionsdauer"] = data["langeInvestitionsdauer"]
    elif investitionsdauer == "1 Quartal":
        xlsFile = "Quartal"
    elif investitionsdauer == "1 Jahr":
        xlsFile = "Jahr"
    elif investitionsdauer == "2 Jahre":
        xlsFile = "2Jahre"
    if data["anlagepräferenzen"] == "Indirekte Immobilienanlage":

        solver_data = pd.read_excel(
            f"api/DATA/nur_indirekt\{xlsFile}.xlsm",
            sheet_name="Result",
            usecols="A:H",
            nrows=21,
            header=1,
            converters={
                "Risk": lambda value: "{}%".format(round(value * 100, 2)),
                "Return": lambda value: "{}%".format(round(value * 100, 2)),
            },
        )
    elif data["anlagepräferenzen"] == "Beides":
        solver_data = pd.read_excel(
            f"api\DATA/Mit_Immo_statt_RX\{xlsFile}.xlsm",
            sheet_name="Result",
            usecols="A:H",
            nrows=21,
            header=1,
            converters={
                "Risk": lambda value: "{}%".format(round(value * 100, 2)),
                "Return": lambda value: "{}%".format(round(value * 100, 2)),
            },
        )
    else:
        solver_data = pd.read_excel(
            "api/DATA/nur_immo/2Jahre.xlsm",
            sheet_name="Result",
            usecols="A:F",
            nrows=21,
            header=1,
            converters={
                "Risk": lambda value: "{}%".format(round(value * 100, 2)),
                "Return": lambda value: "{}%".format(round(value * 100, 2)),
            },
        )
    print(data)
    # solver_data = solver_data.cumsum()
    # solver_data.plot.scatter(x="Risk", y="Return")
    # plt.show()
    """

    {'investitionsdauer': '15', 
    'Investitionsrahmen': '100.000,00\xa0€', 
    'hatKredit': 'Ja', 
    'Kredit': '100.000,00\xa0€', 
    'nutzen': 'Beides', 
    'anlageklassen': ['Aktien', 'Immobilien', 'Anleihen', 'Rohstoffe', 'Immobilienfond', 'REITs'], 
    'amount': {'REITs': '1000000', 'Immobilienfond': '1000000', 'Rohstoffe': '1000000', 'Anleihen': '1000000', 'Immobilien': '10000000', 'Aktien': '1000000'}, 
    'anlageverwalter': 'Ja', 
    'Risikobereitschaft': 'Hoch', 
    'anlagepräferenzen': 'Beides'}
    """
    # set variables from json
    kreditData = None
    if data["hatKredit"] == "Ja":
        kreditData = {"Kredit": data["Kredit"]}

    user_data = {
        "RISIKO": data["Risikobereitschaft"],
        "INVESTITIONSDAUER": data["investitionsdauer"],
        "INVESTITIONSRAHMEN": data["Investitionsrahmen"],
        "KREDIT": data["Kredit"],
        "NUTZEN": data["nutzen"],
        "ANLAGEKLASSEN": data["anlageklassen"],
        "ANLAGEKLASSEN_AMOUNT": json.dumps(data["amount"]),
        "IMMOBILIENVERWALTER": data["Immobilienverwalter"],
        "RISIKOBEREITSCHAFT": data["Risikobereitschaft"],
        "ANLAGEPRÄFERENZ": data["anlagepräferenzen"],
    }

    print(user_data)
    """ user_data = json.dumps(user_data) """
    # , USER_DATA=json.dumps(user_data)
    return jsonify({"DATA": solver_data.to_json(), "USER_DATA": json.dumps(user_data)})


@main.route("/movies")
def movies():
    solver_data = pd.read_excel(
        "api\PortfolioOptimierung_4_Immodirekt_2_Jahre.xlsm",
        sheet_name="Result",
        usecols="A:F",
        nrows=21,
        header=1,
        converters={
            "Risk": lambda value: "{}%".format(round(value * 100, 2)),
            "Return": lambda value: "{}%".format(round(value * 100, 2)),
        },
    )
    # Risiko : Hoch,Mittel.Niedrig
    """ print(solver_data.plot(x="Risk", y="Return")) """

    return jsonify({"DATA": solver_data.to_json(), "RISIKO": "Mittel"})

import React from "react";
import PropTypes from "prop-types";
import "./FForm.css";
import "./normalize.css";
import "../../assets/styles/cs-select.css";
import "../../assets/styles/cs-skin-boxes.css";
import Layout from "../../components/Layout/Layout";
import Frames from "../../components/Frames/Frames";
import Controls from "../../components/Controls/Controls";
import Continue from "../../components/Controls/Continue/Continue";
import Nav from "../../components/Controls/Nav/Nav";
import Progress from "../../components/Controls/Progress/Progress";
import Dot from "../../components/Controls/Nav/Dot/Dot";
import { generateId } from "../../core/util";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import Back from "../../components/Controls/Back";

class FForm extends React.PureComponent {
  constructor(props) {
    super(props);
    const { ctrlProgress, ctrlNavDots, ctrlNavPosition } = this.props;
    const self = this;
    window.document.addEventListener("keydown", (event) => {
      const keyCode = event.keyCode || event.which;
      if (keyCode === 13) {
        event.preventDefault();
        self.nextClickHandler();
      }
    });
    this.state = {
      current: 0,
      isAnimating: false,
      animationDirection: undefined,
      error: false,
      errorMessage: undefined,
      // isLastStep: false,
      options: {
        ctrlProgress,
        ctrlNavDots,
        ctrlNavPosition,
      },
    };
  }

  nextClickHandler = () => {
    const { current } = this.state;
    this.changeCurrentIndex(current + 1, "next");
  };
  backClickHandler = () => {
    const { current } = this.state;
    this.changeCurrentIndex(current - 1, "prev");
  };

  navDotClickHandler = (index) => {
    this.changeCurrentIndex(index, "prev");
  };

  changeCurrentIndex = (newIndex, direction) => {
    let { current } = this.state;
    if (!this.validate() && newIndex > current) return;
    const oldCurrent = current;
    current = newIndex;
    this.setState(
      {
        current,
        isAnimating: true,
        animationDirection: direction,
        oldCurrent,
        error: false,
        errorMessage: undefined,
      },
      () => {
        setTimeout(() => {
          this.setState({
            isAnimating: false,
            animationDirection: undefined,
            oldCurrent: undefined,
          });
        }, 800);
      }
    );
  };

  validate = () => {
    const frame = document.querySelector(".fs-fields > li.fs-current");
    if (!frame) {
      return false;
    }
    const inputs =
      frame.querySelectorAll("input[required]") ||
      frame.querySelector("textarea[required]") ||
      frame.querySelector("select[required]");
    if (inputs.length === 0) return true;

    let error;
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      switch (input.tagName.toLowerCase()) {
        case "input":
          if (input.value === "") {
            error = "NOVAL";
          }
          break;

        case "select":
          // assuming here '' or '-1' only
          if (input.value === "" || input.value === "-1") {
            error = "NOVAL";
          }
          break;

        case "textarea":
          if (input.value === "") {
            error = "NOVAL";
          }
          break;
        default:
      }
    }

    if (error) this.showError(error);
    return error === undefined;
  };

  showError = (error) => {
    let errorMessage;
    switch (error) {
      case "NOVAL":
        errorMessage = "Bitte ausfüllen";
        break;
      default:
    }
    this.setState({ error: true, errorMessage });
  };

  renderFrames = (frameElements) => {
    const frames = [];
    const { current, isAnimating, oldCurrent } = this.state;

    for (let i = 0; i < frameElements.length; i++) {
      const id = generateId();
      const classList = [];
      if (isAnimating) {
        if (i === oldCurrent) classList.push("fs-hide");
        else if (i === current) classList.push("fs-current fs-show");
      } else if (i === current) {
        classList.push("fs-current");
      }
      frames.push(
        React.cloneElement(frameElements[i], {
          id,
          classList: classList.join(" "),
          key: i,
        })
      );
    }
    return frames;
  };

  renderNavDots = (count, current) => {
    const dots = [];
    for (let i = 0; i < count; i++) {
      dots.push(
        <Dot
          index={i}
          isCurrent={i === current}
          isPrev={i < current}
          key={i}
          onClick={this.navDotClickHandler}
        />
      );
    }
    return <Nav>{dots}</Nav>;
  };

  renderProgress = (count, current) => (
    <Progress total={count} current={current} />
  );

  render() {
    const {
      current,
      options,
      isAnimating,
      animationDirection,
      error,
      errorMessage,
    } = this.state;
    const { children, title, submitText, onSubmit } = this.props;
    const frameElements = children.filter((c) => c && c.props && c.props.show);
    children.filter((c, i) => {
      if (Array.isArray(c) && c[0]) {
        c.forEach((e) => {
          frameElements.splice(i, 0, e);
        });
      }
    });

    const overview = current === frameElements.length;
    if (overview)
      window.document.querySelector("body").classList.add("overview");
    return (
      <Layout title={title}>
        <Frames
          isAnimating={isAnimating}
          animationDirection={animationDirection}
          overview={overview}
          submitText={submitText}
          submitClickHandler={onSubmit}
        >
          {this.renderFrames(frameElements)}
        </Frames>
        {!overview ? (
          <Controls>
            <Continue
              clickHandler={!isAnimating ? this.nextClickHandler : null}
            />
            {current !== 0 && (
              <Back
                clickHandler={!isAnimating ? this.backClickHandler : null}
              ></Back>
            )}
            {options.ctrlNavDots
              ? this.renderNavDots(frameElements.length, current)
              : null}
            {options.ctrlProgress
              ? this.renderProgress(frameElements.length, current)
              : null}
          </Controls>
        ) : null}
        {error ? <ErrorMessage message={errorMessage} /> : null}
      </Layout>
    );
  }
}

FForm.propTypes = {
  ctrlProgress: PropTypes.bool,
  ctrlNavDots: PropTypes.bool,
  ctrlNavPosition: PropTypes.bool,
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  submitText: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
};

FForm.defaultProps = {
  ctrlProgress: true,
  ctrlNavPosition: true,
  ctrlNavDots: true,
  submitText: "Jetzt berechnen",
};

export default FForm;

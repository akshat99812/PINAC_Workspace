import React,{ useState, useEffect, useRef } from "react";
import { MarkdownStyle } from "../components/MarkdownStyle";
import { EmailComposeBox } from "../components/EmailComposeBox";
import { ScheduleViewer } from "../components/ScheduleViewer";
import "./style/MessageViewer.css";

// Icons
import userIcon from "../assets/icon/user_icon.png";
import pinacLogo from "../assets/icon/pinac-logo.png";

interface ShowAiMessageProps {
  setButtonsDisabled : React.Dispatch<React.SetStateAction<boolean>>
}

export const ShowAiMessage: React.FC<ShowAiMessageProps> = ({setButtonsDisabled}) => {
  const [message, setMessage] = useState(<AiLoader/>);
  const chatboxscrollRef = useRef<HTMLDivElement>(null); // Ref for auto scrolling

    // Function to scroll the chatbox to the bottom
    const scrollToBottom = () => {
      if (chatboxscrollRef.current) {
        chatboxscrollRef.current.scrollTop =
          chatboxscrollRef.current.scrollHeight;
      }
    };
  useEffect(() => {
  window.ipcRenderer.once("server-response", (_, response) => {
    if (response["response"]["type"] === "email") {
      const text = "Here is your email, check it out:";
      const subject = response["response"]["email-subject"];
      const body = response["response"]["email-body"];
      setMessage(
        // <EmailMessage response={text} subject={subject} body={body} />
        <AiMessage response={`${text}\n${subject}\n\n${body}`} setButtonsDisabled={setButtonsDisabled} />
      );
      // } else if (response["response"]["type"] === "schedule") {
      //   setMessage(<ScheduleMessage schedule={response[1]} />);
    } else {
      setMessage(<AiMessage response={response["response"]["content"]} setButtonsDisabled={setButtonsDisabled} />);
    }
    });
    }, []); // Empty dependency array to ensure the effect runs only once
  useEffect(() => {
    scrollToBottom(); // Auto scroll to bottom after AI response
  }, [message]);

  return <div ref={chatboxscrollRef}>{message}</div>;
};

interface ShowHumanMessageProps {
  response: string;
}

export const ShowHumanMessage: React.FC<ShowHumanMessageProps> = (props) => {
  const [isAvatarVisible, setIsAvatarVisible] = useState(
    window.innerWidth > 576
  ); // Initial state based on window size

  // Handle window resize and update avatar visibility
  useEffect(() => {
    const updateAvatarVisibility = () => {
      setIsAvatarVisible(window.innerWidth > 576);
    };
    window.addEventListener("resize", updateAvatarVisibility);
    // Cleanup function to remove the event listener
    return () => window.removeEventListener("resize", updateAvatarVisibility);
  }, []);

  return (
    <>
      <div className="msg-row">
        {isAvatarVisible && (
          <div className="msg-avatar">
            <img src={userIcon} alt="User Avatar" />
          </div>
        )}
        <div className="msg-content">
          <div className="msg-name">You</div>
          <div className="msg-text human-msg">{props.response}</div>
        </div>
      </div>
    </>
  );
};

interface AiMessageProps {
  response: string;
  setButtonsDisabled : React.Dispatch<React.SetStateAction<boolean>>
}

export const AiMessage: React.FC<AiMessageProps> = (props) => {
  const {setButtonsDisabled} = props;
  const [isAvatarVisible, setIsAvatarVisible] = useState(
    window.innerWidth > 576
  ); // Initial state based on window size
  const [currentText, setCurrentText] = useState(""); // Text state for typing effect
  const [currentIndex, setCurrentIndex] = useState(0); // Index state to emulate writing effect by displaying till certain index
  const delay = 50; // Delay for writing each character
  const chatboxscrollRef = useRef<HTMLDivElement>(null); // Ref for auto-scrolling

  // Function to scroll the chatbox to the bottom
  const scrollToBottom = () => {
    if (chatboxscrollRef.current) {
      chatboxscrollRef.current.scrollTop =
        chatboxscrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if(currentIndex >= props.response.length-5) setButtonsDisabled(false);
    if (currentIndex < props.response.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + props.response[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
        scrollToBottom(); // Auto scroll to bottom during typing effect
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay]); // Handle the typing effect by creating a timeout while whole string is not written

  // Handle window resize and update avatar visibility
  useEffect(() => {
    const updateAvatarVisibility = () => {
      setIsAvatarVisible(window.innerWidth > 576);
    };
    window.addEventListener("resize", updateAvatarVisibility);
    // Cleanup function to remove the event listener
    return () => window.removeEventListener("resize", updateAvatarVisibility);
  }, []);

  return (
    <>
      <div className="msg-row">
        {isAvatarVisible && (
          <div className="msg-avatar">
            <img src={pinacLogo} alt="AI Avatar" />
          </div>
        )}
        <div className="msg-content">
          <div className="msg-name">PINAC</div>
          <div className="msg-text ai-msg">
            <MarkdownStyle text={currentText} />
          </div>
        </div>
      </div>
    </>
  );
};

// Creating a AiLoader component similar to AiMessage. message state is initialised with this loader and replaced as soon as we have the data.
export const AiLoader: React.FC = () => {
  const [isAvatarVisible, setIsAvatarVisible] = useState(
    window.innerWidth > 576
  ); // Initial state based on window size

  // Handle window resize and update avatar visibility
  useEffect(() => {
    const updateAvatarVisibility = () => {
      setIsAvatarVisible(window.innerWidth > 576);
    };
    window.addEventListener("resize", updateAvatarVisibility);
    // Cleanup function to remove the event listener
    return () => window.removeEventListener("resize", updateAvatarVisibility);
  }, []);

  return (
    <>
      <div className="msg-row">
        {isAvatarVisible && (
          <div className="msg-avatar">
            <img src={pinacLogo} alt="AI Avatar" />
          </div>
        )}
        <div className="msg-content">
          <div className="msg-name">PINAC</div>
          <div className="msg-text ai-msg">
            <div className="loader" />
          </div>
        </div>
      </div>
    </>
  );
};

interface EmailMessageProps {
  response: string;
  subject: string;
  body: string;
}

export const EmailMessage: React.FC<EmailMessageProps> = (props) => {
  const [isAvatarVisible, setIsAvatarVisible] = useState(
    window.innerWidth > 576
  ); // Initial state based on window size

  // Handle window resize and update avatar visibility
  useEffect(() => {
    const updateAvatarVisibility = () => {
      setIsAvatarVisible(window.innerWidth > 576);
    };
    window.addEventListener("resize", updateAvatarVisibility);
    // Cleanup function to remove the event listener
    return () => window.removeEventListener("resize", updateAvatarVisibility);
  }, []);

  return (
    <>
      <div className="msg-row">
        {isAvatarVisible && (
          <div className="msg-avatar">
            <img src={pinacLogo} alt="AI Avatar" />
          </div>
        )}
        <div className="msg-content">
          <div className="msg-name">PINAC</div>
          <div className="msg-text ai-msg">{props.response}</div>
        </div>
      </div>
      <EmailComposeBox emailSubject={props.subject} emailBody={props.body} />
    </>
  );
};

interface ScheduleMessageProps {
  schedule: {
    id: number;
    title: string;
    start: string | Date;
    end: string | Date | undefined;
    type: "event" | "task";
  }[];
}

export const ScheduleMessage: React.FC<ScheduleMessageProps> = (props) => {
  return <ScheduleViewer events={props.schedule} />;
};

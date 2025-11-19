import { useState } from "react";

export const useCustomAlert = () => {
    const [alertData, setAlertData] = useState({
        visible: false,
        title: "",
        message: "",
        buttonText: "OK",
        onClose: () => { },
    });

    const showAlert = (title: string, message: string, onClose?: () => void, buttonText: string = "OK") => {
        setAlertData({
            visible: true,
            title,
            message,
            buttonText,
            onClose: onClose || (() => { }),
        });
    };

    const hideAlert = () => {
        setAlertData({ ...alertData, visible: false });
        alertData.onClose();
    };

    return { alertData, showAlert, hideAlert };
};

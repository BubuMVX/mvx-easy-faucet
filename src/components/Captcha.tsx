import {PropsWithoutRef, useRef} from "react";
import ReCAPTCHA from "react-google-recaptcha";

type CaptchaProps = {
    recaptchaKey: string,
    onSubmitedCaptcha: (token: string) => void
}

export const Captcha = (
    {
        recaptchaKey,
        onSubmitedCaptcha,
    }: PropsWithoutRef<CaptchaProps>
) => {
    const recaptchaRef = useRef<ReCAPTCHA>(null)

    const onCaptcha = async () => {
        if (recaptchaRef.current == undefined) {
            return
        }

        const token = recaptchaRef.current.getValue()

        if (token == null) {
            return
        }

        onSubmitedCaptcha(token)
    }

    return (
        <div className="recaptcha">
            <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={recaptchaKey}
                onChange={onCaptcha}
            />
        </div>
    )
}
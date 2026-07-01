import React from "react";
import { withTranslation } from "react-i18next";

const ContactPage = () => {

    return (
        <div>Contact Page
            <p>long content</p>
            {
                // indicates very long content
                Array.from(
                    {
                        length: 100,
                    },
                    (_, index) => (
                        <React.Fragment key={index}>
                            {index % 20 === 0 && index ? 'more' : '...'}
                            <br />
                        </React.Fragment>
                    ),
                )
            }
        </div>
    );
}

export default withTranslation()(ContactPage);
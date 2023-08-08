import React, { useState } from 'react';

export const CopyToClipboard = () => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        const textToCopy = 'Text to be copied';

        // Create a temporary textarea element
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);

        // Select and copy the text
        textarea.select();
        document.execCommand('copy');

        // Clean up
        document.body.removeChild(textarea);

        setIsCopied(true);
    };

    return (
        <div>
            <button onClick={handleCopy}>Copy to Clipboard</button>
            {isCopied && <span>Text copied to clipboard!</span>}
        </div>
    );
}

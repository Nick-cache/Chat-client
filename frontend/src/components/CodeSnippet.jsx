import Lowlight from "react-lowlight";

import "react-lowlight/common";

const CodeSnippet = (snippet, language) => {
    const found = Lowlight.hasLanguage(language);

    return <Lowlight language={found ? language : undefined} value={snippet} />;
}

export default CodeSnippet;

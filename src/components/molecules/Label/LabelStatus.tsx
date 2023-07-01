import { PathUtil } from "../../../utils/Utilities";
import { ApiStatus, Error, Maybe } from "typedefs/types";
import Font, { FontStatus } from "../Font/Font";

interface StatusLabelProps {
    apiStatus: ApiStatus;
    sourcePath: string;
    outputPath: string;
    apiError: Maybe<Error>;
}

type PathStatus = {
    runs: string;
    status: FontStatus;
}

export const LabelStatus = ({ apiStatus, sourcePath, outputPath, apiError }: StatusLabelProps) => {
    const sourceStatus: PathStatus = sourcePath
        ? { runs: `Video Source: ${PathUtil.getFilename(sourcePath)}`, status: 'ACTIVATED' }
        : { runs: 'Video source not selected', status: 'NORMAL' };
    
    const outputStatus: PathStatus = outputPath
        ? { runs: `Output Directory: ${outputPath}`, status: 'ACTIVATED' }
        : { runs: 'Output directory not specified', status: 'NORMAL' };

    return (
        <>
            {
                apiError 
                ? <>
                    <Font label={apiStatus} fontType={'h2'} fontFamily={'consolas'}/>
                    <Font label={apiError.message} fontType={'h3'} fontStatus={'CRITICAL'}/>
                  </>
                : <Font label={apiStatus} fontType={'h1'} fontFamily={'consolas'}/>
            }
            <Font label={sourceStatus.runs} fontType={'h2'} fontStatus={sourceStatus.status} tooltipAttach={{ title: sourcePath, placement: 'top-end'}}/>
            <Font label={outputStatus.runs} fontType={'h2'} fontStatus={outputStatus.status}/>
        </>
    )
}
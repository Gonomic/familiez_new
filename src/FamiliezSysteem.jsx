import { useSignal } from '@preact/signals-react'
import { useSignals } from '@preact/signals-react/runtime'
import Box from '@mui/material/Box'

const FamiliezSysteem = () => {
    useSignals();
    const DBDtFeReq = useSignal("");
    const DBDtMwReq = useSignal("");
    const DBDtBeReq = useSignal("");
    const DBDtBeAnsw = useSignal("");
    const DBDtMwAnsw = useSignal("");
    const DBFEDtRec = useSignal("");
    const DBFEDtRoundTrip = useSignal("");

    const MWDtFeReq = useSignal("");
    const MWDtMwReq = useSignal("");

    const FEFEDtRec = useSignal("");
    const FEFEDtRoundTrip = useSignal("");

    const handleButtonClickToPingMW = async () => {
        try {
            const startTime = Date.now();
            const now = new Date();
            const offset = now.getTimezoneOffset() * 60000; // Offset in milliseconds
            const localISOTimeAsString = new Date(now - offset).toISOString().slice(0, -1);

            const url = `http://localhost:8000/pingAPI?timestampFE=${localISOTimeAsString}`;

            const response = await fetch(url);
            const data = await response.json();
            const endTime = Date.now();
            
            MWDtFeReq.value = data[0]["FE request time"];
            MWDtMwReq.value = data[0]["MW request time"];
            const nowAfter = new Date();
            FEFEDtRec.value = new Date(nowAfter - nowAfter.getTimezoneOffset() * 60000).toISOString().slice(0, -1);
            FEFEDtRoundTrip.value = `${(endTime - startTime).toFixed(2)} ms`;

        } catch (error) {
            console.error('Error getting Ping data from API (calling MW):', error);
        }
    };

    const handleButtonClickToPingDB = async () => {
        try {
            const startTime = Date.now();
            const now = new Date();
            const offset = now.getTimezoneOffset() * 60000; // Offset in milliseconds
            const localISOTime = new Date(now - offset).toISOString().slice(0, -1);

            const url = `http://localhost:8000/pingDB?timestampFE=${localISOTime}`;

            const responseDB = await fetch(url);
            const data = await responseDB.json();
            const endTime = Date.now();
            
            DBDtFeReq.value = data[0]["datetimeFErequest"];
            DBDtMwReq.value = data[0]["datetimeMWrequest"];
            DBDtBeReq.value = data[0]["datetimeBErequest"];
            DBDtBeAnsw.value = data[0]["datetimeBEanswer"];
            DBDtMwAnsw.value = data[0]["datetimeMWanswer"];
            const nowAfter = new Date();
            DBFEDtRec.value = nowAfter.toISOString().slice(0, -1);
            DBFEDtRoundTrip.value = `${(endTime - startTime).toFixed(2)} ms`;

        } catch (error) {
            console.error('Error getting Ping data from API (calling DB):', error);
        }
    };
    return (
        <Box sx={{ position: 'absolute', top: '64px', bottom: '72px', height: 'calc(100% - 136px)', width: '100%', overflow: 'auto' }}>
            <div>Familiez systeem, FTW!</div>
            <button onClick={handleButtonClickToPingMW}>Ping MiddleWare</button>
            <pre> Frontend request Time as reported by client=        {MWDtFeReq.value} </pre>
            <pre> Middleware request Time as reported bij Middleware= {MWDtMwReq.value} </pre>
            <pre> Frontend receive Time as reported by Client=        {FEFEDtRec.value}</pre>
            <pre> Complete roundtrip Time=                            {FEFEDtRoundTrip.value}</pre>

            <button onClick={handleButtonClickToPingDB}>Ping Database</button>
            <pre> Frontend request Time as reported by client=       {DBDtFeReq.value} </pre>
            <pre> Middleware request Time as reported by Middleware= {DBDtMwReq.value} </pre>
            <pre> Backend request Time as reported by Backend=       {DBDtFeReq.value} </pre>
            <pre> Backend answer Time as reported by Backend=        {DBDtBeAnsw.value} </pre>
            <pre> Middleware answer Time as reported by Middleware=  {DBDtMwAnsw.value} </pre>
            <pre> Frontend receive Time as reported by Client=       {DBFEDtRec.value}</pre>
            <pre> Complete roundtrip Time=                           {DBFEDtRoundTrip.value}</pre>
        </Box>

    );
};

export default FamiliezSysteem;
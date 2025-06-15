'use client'

import {useState} from "react";
import {toast} from "sonner";
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

registerPlugin(FilePondPluginFileValidateType);

export default function Home() {

  const [pond, setPond] = useState<any>(null)
  const [resumeText, setResumeText] = useState("")
  
  if (pond) {
    pond.removeFiles()
  }

  return (
    <>
      <div className="mt-1">
        <FilePond
          ref={(ref: any) => setPond(ref)}
          allowMultiple={false}
          acceptedFileTypes={["application/pdf"]}
          labelIdle='Drag & Drop resume or <span class="filepond--label-action">Browse</span>'
          name="filepond"
          server={{
            process: {
              url: "/api/upload",
              method: "POST",
              withCredentials: false,
              onload: (response) => {
                console.log("upload response", response);
                const resumeDetail = JSON.parse(response);

                setResumeText(resumeDetail.parsedText);
                return response;
              },
              onerror: (error: any) => {
                toast.error("Failed to parse resume. Please try another file.");
                return error;
              },
            },
            fetch: null,
            revert: null,
          }}
          onremovefile={() => {
            setResumeText("");
          }}
        />
        {resumeText && (
          <div className="mt-2 p-2 bg-muted rounded-md">
            <span className="text-xs text-green-500">
              Resume successfully parsed! ({resumeText.length} characters)
            </span>
          </div>
        )}
      </div>
    </>
  );
}



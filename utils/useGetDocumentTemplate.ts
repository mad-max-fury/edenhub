import { notify } from "@/components";
import { useLazyGetDocumentFormUrlQuery } from "@/redux/api/documentTemplate";

import { getErrorMessage } from "./getErrorMessges";

export default function useGetDocumentTemplate() {
  const [getDocumentFormUrl, { isLoading }] = useLazyGetDocumentFormUrlQuery();

  const downloadDocumentTemplate = async (id: string) => {
    try {
      const response = await getDocumentFormUrl(id).unwrap();

      const anchor = document.createElement("a");
      anchor.href = response?.data?.formUrl;
      anchor.download = "";
      anchor.target = "_blank";
      anchor.click();
    } catch (error) {
      notify.error({
        message: "Download failed",
        subtitle: getErrorMessage(error),
      });
    }
  };

  return { downloadDocumentTemplate, isLoading };
}

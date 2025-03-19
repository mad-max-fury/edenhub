import { notify } from "@/components";
import { useLazyGetFormTemplateUrlQuery } from "@/redux/api";

import { getErrorMessage } from "./getErrorMessges";

export default function useGetFormTemplate() {
  const [getFormTemplate, { isLoading }] = useLazyGetFormTemplateUrlQuery();
  const downloadTemplate = async (id: string) => {
    try {
      // Fetch the template data
      const response = await getFormTemplate(id).unwrap();

      const anchor = document.createElement("a");
      anchor.href = response?.data?.formUrl;
      anchor.download = ""; // Let the server determine the filename
      anchor.target = "_blank"; // Optional: opens the file in a new tab
      anchor.click();
    } catch (error) {
      notify.error({
        message: "Download failed",
        subtitle: getErrorMessage(error),
      });
    }
  };

  return { downloadTemplate, isLoading };
}

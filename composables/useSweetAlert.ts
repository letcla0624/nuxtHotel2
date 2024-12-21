import type { SweetAlertIcon } from "sweetalert2";

export default function useSweetAlert() {
  // 使用 plugin
  const { $swal } = useNuxtApp();

  const sweetAlert = (icon: SweetAlertIcon, title: string, text?: string) =>
    $swal.fire({
      position: "center",
      icon,
      title,
      text,
      showConfirmButton: false,
      timer: 1500,
    });

  return { sweetAlert };
}

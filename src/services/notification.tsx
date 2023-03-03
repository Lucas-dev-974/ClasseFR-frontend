import { removeNotif } from "../signaux"

export default function Notification(props: any){
    const close = () => {
        (new te.Alert(document.getElementById("alert" + props.notif.id))).close()
        removeNotif(props.notif.id)
    }

    return<>
        <div id={"alert" + props.notif.id } class="z-[1056] w-fit absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2  mx-auto flex p-4 mb-4 text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400" >
            <div class="ml-3 text-sm font-medium">{ props.notif.message }</div>
            <button type="button" onClick={close} class="ml-auto -mx-1.5 -my-1.5 bg-blue-50 text-blue-500 rounded-lg focus:ring-2 focus:ring-blue-400 p-1.5 hover:bg-blue-200 inline-flex h-8 w-8 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700" >
                <span class="sr-only" onClick={close}>Close</span>
                <svg aria-hidden="true" onClick={close} class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
            </button>
        </div>
    </>
}
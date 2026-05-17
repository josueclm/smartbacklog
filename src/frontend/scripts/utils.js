        //  function toggleSidebar() {
        //      const sidebar = document.getElementById('sidebar');
        //      const overlay = document.getElementById('sidebar-overlay');
        //      sidebar.classList.toggle('mobile-hidden');
        //      overlay.classList.toggle('hidden');
        //      if (!sidebar.classList.contains('mobile-hidden')) {
        //          document.body.classList.add('overflow-hidden');
        //      } else {
        //          document.body.classList.remove('overflow-hidden');
        //      }
        //  }
        

         function formatDate(date) {

            if (!date) return "-";

            return new Date(date).toLocaleDateString("pt-PT");

         }


         function showNotification(message, type = "success", duration = 3000) {
            let toast = document.getElementById('global-toast');

            // cria se não existir
            if (!toast) {
               toast = document.createElement('div');
               toast.id = 'global-toast';
               document.body.appendChild(toast);

               toast.className = `
                     fixed top-5 left-1/2 -translate-x-1/2 z-50
                     px-4 py-3 rounded-lg shadow-lg
                     text-white text-sm font-medium
                     transform transition-all duration-300
                     opacity-0 -translate-y-10
               `;
            }

            // tipos de cor
            const types = {
               success: "bg-green-600",
               error: "bg-red-600",
               warning: "bg-yellow-500",
               info: "bg-blue-600"
            };

            // limpar cores antigas
            toast.classList.remove(
               "bg-green-600",
               "bg-red-600",
               "bg-yellow-500",
               "bg-blue-600"
            );

            // aplicar nova cor
            toast.classList.add(types[type] || types.success);

            // mensagem
            toast.innerText = message;

            // mostrar (desce suavemente)
            toast.classList.remove('opacity-0', '-translate-y-10');
            toast.classList.add('opacity-100', 'translate-y-0');

            // esconder
            setTimeout(() => {
               toast.classList.add('opacity-0', '-translate-y-10');
               toast.classList.remove('opacity-100', 'translate-y-0');
            }, duration);
         }


         function startSubmit() {
            const btn = document.getElementById('save-btn');
            const icon = document.getElementById('save-icon');
            const spinner = document.getElementById('save-spinner');
            const text = document.getElementById('save-btn-db');

            btn.disabled = true;
            btn.classList.add('opacity-80', 'cursor-not-allowed');

            // força estado correto
            icon.classList.add('hidden');
            spinner.classList.remove('hidden');

            text.innerText = "Salvando...";
         }

         function finishSubmit() {
            const btn = document.getElementById('save-btn');
            const icon = document.getElementById('save-icon');
            const spinner = document.getElementById('save-spinner');
            const text = document.getElementById('save-btn-db');
            const toast = document.getElementById('save-toast');

            btn.disabled = false;
            btn.classList.remove('opacity-80', 'cursor-not-allowed');

            // IMPORTANTE: reset visual correto
            spinner.classList.add('hidden');
            icon.classList.remove('hidden');

            text.innerText = "Salvar Alterações";

            // Toast
            toast.classList.remove('opacity-0', 'translate-y-10');
            toast.classList.add('opacity-100', 'translate-y-0');

            setTimeout(() => {
               toast.classList.add('opacity-0', 'translate-y-10');
               toast.classList.remove('opacity-100', 'translate-y-0');
            }, 3000);
         }
     
         function simulateSave() {
            startSubmit();

            setTimeout(() => {
               finishSubmit();
            }, 1500);
         }


         function showConfirm({
            title = "Confirmar ação",
            message = "Tens a certeza que queres continuar?",
            confirmText = "Confirmar",
            cancelText = "Cancelar"
         } = {}) {

            return new Promise((resolve) => {

               // criar overlay
               const overlay = document.createElement('div');
               overlay.className = `
                     fixed inset-0 z-50 flex items-center justify-center
                     bg-black/50 backdrop-blur-sm
               `;

               // criar modal
               const modal = document.createElement('div');
               modal.className = `
                     bg-white rounded-xl shadow-lg w-full max-w-md p-6
                     transform transition-all duration-300 scale-95 opacity-0
               `;

               modal.innerHTML = `
                     <h2 class="text-lg font-semibold mb-2">${title}</h2>
                     <p class="text-sm text-gray-600 mb-6">${message}</p>

                     <div class="flex justify-end gap-3">
                        <button id="confirm-cancel" 
                           class="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100">
                           ${cancelText}
                        </button>

                        <button id="confirm-ok" 
                           class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                           ${confirmText}
                        </button>
                     </div>
               `;

               overlay.appendChild(modal);
               document.body.appendChild(overlay);

               // animação entrada
               setTimeout(() => {
                     modal.classList.remove('scale-95', 'opacity-0');
                     modal.classList.add('scale-100', 'opacity-100');
               }, 10);

               // handlers
               modal.querySelector('#confirm-ok').onclick = () => {
                     close(true);
               };

               modal.querySelector('#confirm-cancel').onclick = () => {
                     close(false);
               };

               overlay.onclick = (e) => {
                     if (e.target === overlay) close(false);
               };

               function close(result) {
                     modal.classList.add('scale-95', 'opacity-0');

                     setTimeout(() => {
                        overlay.remove();
                        resolve(result);
                     }, 200);
               }
            });
         }


window.startSubmit = startSubmit;
window.finishSubmit = finishSubmit;
window.simulateSave = simulateSave;
window.showConfirm = showConfirm;
window.showNotification = showNotification;
window.formatDate = formatDate;
document.addEventListener('DOMContentLoaded', () => {
    const editBtn = document.getElementById('edit-btn');
    const printBtn = document.getElementById('print-btn');
    const cvBody = document.getElementById('cv-body');
    const profileImg = document.getElementById('profile-img');
    const fileInput = document.getElementById('file-input');
    const uploadOverlay = document.getElementById('upload-overlay');

    let isEditMode = false;

    // Load data from localStorage
    loadCVData();

    // Toggle Edit Mode
    editBtn.addEventListener('click', () => {
        isEditMode = !isEditMode;
        document.body.classList.toggle('edit-mode-active', isEditMode);
        
        const editableElements = document.querySelectorAll('[data-edit]');
        editableElements.forEach(el => {
            el.contentEditable = isEditMode;
        });

        editBtn.textContent = isEditMode ? 'Finish Editing' : 'Edit CV';
        editBtn.classList.toggle('btn-secondary', isEditMode);
        
        if (!isEditMode) {
            saveCVData();
        }
    });

    // Print CV
    printBtn.addEventListener('click', () => {
        if (isEditMode) {
            alert('Please finish editing before printing.');
            return;
        }
        window.print();
    });

    // Image Upload
    uploadOverlay.addEventListener('click', () => {
        if (isEditMode) {
            fileInput.click();
        }
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                profileImg.src = event.target.result;
                saveCVData();
            };
            reader.readAsDataURL(file);
        }
    });

    // Auto-save on blur during edit mode
    document.addEventListener('blur', (e) => {
        if (isEditMode && e.target.hasAttribute('data-edit')) {
            saveCVData();
        }
    }, true);

    function saveCVData() {
        const data = {};
        document.querySelectorAll('[data-id]').forEach(el => {
            data[el.getAttribute('data-id')] = el.innerHTML;
        });
        data.profileImage = profileImg.src;
        localStorage.setItem('cvData_bishal_pao', JSON.stringify(data));
    }

    function loadCVData() {
        const savedData = localStorage.getItem('cvData_bishal_pao');
        if (savedData) {
            const data = JSON.parse(savedData);
            document.querySelectorAll('[data-id]').forEach(el => {
                const id = el.getAttribute('data-id');
                if (data[id]) {
                    el.innerHTML = data[id];
                }
            });
            if (data.profileImage) {
                profileImg.src = data.profileImage;
            }
        }
    }
});

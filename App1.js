document.addEventListener("DOMContentLoaded", () => {
    initializeApp();
  });// أول ما الصفحة تخلص تحميل (DOM كله يبقى جاهز)، الكود ده بيشغل الفانكشن اللي اسمها initializeApp
  
let editId = null;

function initializeApp() {//بيربط الفورم اللي ID بتاعه patientForm بفانكشن اسمها handleFormSubmit لما يتعمل Submit.
  /*  نفس الفكرة مع doctorForm و branchForm*/
  document.getElementById('patientForm').addEventListener('submit', event => handleFormSubmit(event, 'patientList', formatPatient));
  document.getElementById('doctorForm').addEventListener('submit', event => handleFormSubmit(event, 'doctorList', formatDoctor));
  document.getElementById('branchForm').addEventListener('submit', event => handleFormSubmit(event, 'branchList', formatBranch));
  
  document.querySelectorAll('nav ul li a').forEach(link => {//بيربط كل اللينكات الموجودة في الـ nav بفانكشن showSection عشان يعرض الـ section المطلوب ويخفي الباقي.
    link.addEventListener('click', event => {
      event.preventDefault();
      const sectionId = event.target.getAttribute('href').slice(1);
      showSection(sectionId);
    });
  });

  showSection('dashboard');
}

function showSection(sectionId) {//بتخفي كل الأقسام (عن طريق إضافة كلاس hidden) وتظهر القسم اللي الـ ID بتاعه هو sectionId
  
  document.querySelectorAll('section').forEach(section => section.classList.add('hidden')); 
  document.getElementById(sectionId).classList.remove('hidden'); 
}

function handleFormSubmit(event, listId, formatter) {//ي فانكشن بتتعامل مع الفورم لما يتعمله submit
  event.preventDefault();//تمنع الريلود الافتراضي
  const form = event.target;
  const inputs = Array.from(form.querySelectorAll('input'));//تجمع البيانات من الحقول
  const values = inputs.map(input => input.value.trim());

  if (values.some(value => !value)) {//تتأكد إن كل الحقول مليانة
    alert('Please fill out all fields.');
    return;
  }

  addListItem(listId, formatter(...values));//تضيف عنصر جديد في الليستة
  form.reset();//تفضي الفورم
}

function addListItem(listId, textContent) {
  const list = document.getElementById(listId);
  const listItem = document.createElement('li');
  listItem.textContent = textContent;

  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.onclick = () => openEditModal(listItem, listId, textContent);//واحد للتعديل (بيفتح مودال التعديل).
  listItem.appendChild(editButton);

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';//واحد للحذف
  deleteButton.onclick = () => list.removeChild(listItem);
  listItem.appendChild(deleteButton);

  list.appendChild(listItem);
}

function openEditModal(item, listId, textContent) {//تفتح مودال التعديل لما تضغط على زرار Edit
  editId = { item, listId, textContent };
  const [name, detail1, detail2] = textContent.split(', ');

  document.getElementById('editName').value = name.split(': ')[1];
  document.getElementById('editDetail1').value = detail1.split(': ')[1];
  const editDetail2Field = document.getElementById('editDetail2');

  if (detail2) {
    editDetail2Field.value = detail2.split(': ')[1];
    editDetail2Field.classList.remove('hidden');//بتخزن التفاصيل في editId، وتفصل النصوص عشان تملأ الحقول.
  } else {
    editDetail2Field.classList.add('hidden');
  }

  document.getElementById('editModal').classList.remove('hidden');
}

function handleEditSubmit(event) {//تعدل البيانات في العنصر اللي تم اختياره
  event.preventDefault();

  const updatedName = document.getElementById('editName').value;//تجمع البيانات الجديدة
  const updatedDetail1 = document.getElementById('editDetail1').value;
  const updatedDetail2 = document.getElementById('editDetail2').value;//تحدث النص

  const updatedText = editId.listId === 'doctorList'
    ? `Doctor: ${updatedName}, Specialty: ${updatedDetail1}, Contact: ${updatedDetail2}`
    : editId.listId === 'branchList'
    ? `Branch: ${updatedName}, Location: ${updatedDetail1}`
    : `Patient: ${updatedName}, Age: ${updatedDetail1}`;

  editId.item.textContent = updatedText;

  addEditDeleteButtons(editId.item, editId.listId);//تضيف الزرارين بتوع Edit و Delete تاني

  closeModal();
}

function addEditDeleteButtons(item, listId) {
  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.onclick = () => openEditModal(item, listId, item.textContent);
  item.appendChild(editButton);

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.onclick = () => item.parentNode.removeChild(item);
  item.appendChild(deleteButton);
}

function closeModal() {
  document.getElementById('editModal').classList.add('hidden');
  document.getElementById('editForm').reset();
}

function formatPatient(name, age) {//دي فانكشنات بتاخد البيانات وتنسقها بشكل نصوص عشان تظهر في الليستة.
  return `Patient: ${name}, Age: ${age}`;
}

function formatDoctor(name, specialty, contact) {//دي فانكشنات بتاخد البيانات وتنسقها بشكل نصوص عشان تظهر في الليستة.
  // Format the contact as a phone number
  const formattedContact = formatPhoneNumber(contact);
  if (formattedContact == false) {
    return alert('Invalid phone number format.');
  }
  else {
    return `Doctor: ${name}, Specialty: ${specialty}, Contact: ${formattedContact}`;
  }
}

function formatBranch(name, location) {//دي فانكشنات بتاخد البيانات وتنسقها بشكل نصوص عشان تظهر في الليستة.
  return `Branch: ${name}, Location: ${location}`;
}

function formatPhoneNumber(contact) {//تنسق رقم الموبايل وتتحقق إنه مكتوب بشكل صحيح
  
  const cleaned = ('' + contact).replace(/\D/g, '');
  
  const match = cleaned.match(/^(\d{1})(\d{2})(\d{3})(\d{4})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}-${match[4]}`; // Format as 0-10-230-8834
    return contact;
  }
  else {
    return false;
  }
  
}


let OpenPopUP = document.querySelector("#add-new");
let Form_Pop = document.querySelector("#form_sec");
let ClosePopUp = document.querySelector("#close-pop")
let form = document.querySelector("form")
let buttons = form.querySelectorAll("button")
OpenPopUP.addEventListener("click", function(){
    Form_Pop.classList.add("active")
})
console.log(buttons)
ClosePopUp.addEventListener("click", function(){
    Form_Pop.classList.remove("active")
})

// form wrapper fun 
let AllInputs = form.querySelectorAll("input")
let MainTag = document.querySelector("#data_tab")
let DataArray = [];
let url = "";
// console.log(Data)
if(localStorage.getItem("DataArray") != null){
    DataArray = JSON.parse(localStorage.getItem("DataArray"))
}
console.log(DataArray)
form.addEventListener("submit", (e)=>{
    e.preventDefault()
    let CheckEmail = DataArray.find((data)=>data.email == AllInputs[1].value);
    if(CheckEmail == undefined){
        DataArray.push({
            name: AllInputs[0].value,
            email: AllInputs[1].value,
            mobile: AllInputs[2].value,
            dob: AllInputs[3].value,
            password: AllInputs[4].value,
            profile : url == "" ? "images/download.jpeg" : url,
        })
        localStorage.setItem("DataArray", JSON.stringify(DataArray));
        console.log(DataArray)
        Swal.fire({
            title: "Good job!",
            text: "Data Inserted Successfully!",
            icon: "success"
          });
          form.reset()
          ClosePopUp.click();
          GetingData()
    }else{
        Swal.fire({
            title: "Email Alerady Exists!",
            text: "Failed!",
            icon: "warning"
          });
    }
})

function GetingData() {
    MainTag.innerHTML = "";
    DataArray.forEach((Data, index) =>{
        let DataStr = JSON.stringify(Data)
        let FinalData = DataStr.replace(/"/g, "'")
        MainTag.innerHTML += `
        <tr class="row" id="row_data">
        <td class="boxes pt-4">${index + 1}</td>
        <td class="p-2 boxes"><img src="${Data.profile}" alt="" width="50" height="50" class="rounded-circle"></td>
        <td class="boxes pt-4 name">${Data.name}</td>
        <td class="boxes pt-4 email">${Data.email}</td>
        <td class="boxes pt-4 number">${Data.mobile}</td>
        <td class="boxes pt-4 date-of">${Data.dob}</td>
        <td class="boxes pt-3">
            <button class="edite-data btn btn-primary btn-sm" index="${index}" data="${FinalData}"><i class="fa-solid fa-pen"></i></button>
            <button class="delet-item btn btn-danger btn-sm" index="${index}"><i class="fa-solid fa-trash"></i></button>
        </td>
    </tr>
    
        `;

    })
    DeletData() 
}

function DeletData() {
    let RemoveData = MainTag.querySelectorAll(".delet-item")
    RemoveData.forEach(btn =>{
        btn.addEventListener("click", async function(){
            let isConfirmed = await Comformed();
            if(isConfirmed){
             let index = btn.getAttribute("index")
            DataArray.splice(index, 1)
            localStorage.setItem("DataArray", JSON.stringify(DataArray));
            GetingData();
            console.log(index)
            }
        })
    })

    let EditeAllBtn = MainTag.querySelectorAll(".edite-data")
    EditeAllBtn.forEach(Edite =>{
        Edite.addEventListener("click", function() {
            let index = Edite.getAttribute("index")
            let dataStr = Edite.getAttribute("Data")
            let FinalData = dataStr.replace(/'/g, '"')
            let data = JSON.parse(FinalData)
            console.log(data)
            OpenPopUP.click();
            AllInputs[0].value = data.name;
            AllInputs[1].value = data.email;
            AllInputs[2].value = data.mobile;
            AllInputs[3].value = data.dob;
            AllInputs[4].value = data.password;
            url = data.profile;
            buttons[0].disabled = false;
            buttons[1].disabled = true;

            buttons[0].addEventListener("click", function(){
                DataArray[index] = {
                    name: AllInputs[0].value,
                    email: AllInputs[1].value,
                    mobile: AllInputs[2].value,
                    dob: AllInputs[3].value,
                    password: AllInputs[4].value,
                    profile : url == "" ? "images/download.jpeg" : url,
                }
                localStorage.setItem("DataArray", JSON.stringify(DataArray));
                console.log(DataArray)
                Swal.fire({
                    title: "Good job!",
                    text: "Data Updated Successfully!",
                    icon: "success"
                  });
                  form.reset()
                  ClosePopUp.click();
                  GetingData()
                  buttons[1].disabled = false;
                  buttons[0].disabled = true;
            })
        })
    })
}




GetingData()


AllInputs[5].addEventListener("change", function(){
    let fReader = new FileReader();
    fReader.readAsDataURL(AllInputs[5].files[0]);
    fReader.addEventListener("load", (e)=>{
        url = e.target.result;
        console.log(url)
    })
})

let Alldelet = document.querySelector("#delet-all")
Alldelet.addEventListener("click", async function(){
    let isConfirmed = await Comformed()
    if(isConfirmed){
        DataArray = [];
        localStorage.removeItem("DataArray");
        GetingData()
    }
})



function Comformed() {
    return new Promise ((resolve, reject)=>{
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: "btn btn-success",
              cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
          });
          swalWithBootstrapButtons.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
                resolve(true)
              swalWithBootstrapButtons.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
              });
            } else if (
              /* Read more about handling dismissals below */
              result.dismiss === Swal.DismissReason.cancel
            ) {
                reject(false)
              swalWithBootstrapButtons.fire({
                title: "Cancelled",
                text: "Your imaginary file is safe :)",
                icon: "error"
              });
            }
          });
    })
}
let formGroupExampleInput = document.querySelector("#formGroupExampleInput");
formGroupExampleInput.oninput = () =>{
    SearchCOntent()
}
 function SearchCOntent(){
    let value = formGroupExampleInput.value.toLowerCase()
    let tr = MainTag.querySelectorAll("#row_data");
    for(let i = 0; i < tr.length; i++){
        let AllTd = tr[i].querySelectorAll(".boxes");
        let name = AllTd[2].innerHTML;
        let email = AllTd[3].innerHTML;
        let number = AllTd[4].innerHTML;
        if(name.toLocaleLowerCase().indexOf(value) != -1 || email.toLocaleLowerCase().indexOf(value) != -1 || number.toLocaleLowerCase().indexOf(value) != -1){
            tr[i].style.display = "";
        }else{
            tr[i].style.display = "none";
        }
    }
 }
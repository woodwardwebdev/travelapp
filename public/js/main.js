let mileageLogBtn = $('#mileage-log-button')
let enterMileageBtn = $('#enter-mileage-button')
let createLocationBtn = $('#create-location-button')

let mileageLog = $('#mileage-log-div');
let enterMileage = $('#enter-mileage-div');
let createLocation = $('#create-location-div');

mileageLogBtn.on('click', function(){
    enterMileage.addClass('hidden');
    createLocation.addClass('hidden');
    mileageLog.removeClass('hidden');
})

enterMileageBtn.on('click', function(){
    enterMileage.removeClass('hidden');
    createLocation.addClass('hidden');
    mileageLog.addClass('hidden');
})

createLocationBtn.on('click', function(){
    enterMileage.addClass('hidden');
    createLocation.removeClass('hidden');
    mileageLog.addClass('hidden');
})
//####################################################################
//############### HAS SPECIAL CHARACTER CHECK FUNCTION ###############
//####################################################################

///////////////////////////
////// THIS FUNCTION //////
///////////////////////////
export function hasSpecialCheck(string) {

  if(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(string)) {
    return true;
  } else {
    return false;
  }

} 
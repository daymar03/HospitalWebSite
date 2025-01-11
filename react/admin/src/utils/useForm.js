export async function useForm ({lastPassword, newPassword, confirmPassword}) {

  let responseMessage

  if (newPassword !== confirmPassword) {
    responseMessage = 'Error: Las contraseñas no coinciden'
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/users/changepassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ lastPassword, password: newPassword, repitPassword: confirmPassword })
    });

    const result = await response.json();

    if (result.success) {
      responseMessage = 'Contraseña cambiada con éxito'
    } else {
      responseMessage = `Error: ${result.error}`
    }
  } catch (error) {
    responseMessage = `Error: ${error.message}`
  }
  return responseMessage
};




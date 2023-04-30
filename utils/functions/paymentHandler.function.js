/**
 * The above code exports three functions that handle calculating the total payment, total paid, and
 * total due based on input values.
 * @param input - an object containing the input values for visaPaymentAmount, passportPaymentAmount,
 * tutorPaymentAmount, visaPaidAmount, passportPaidAmount, tutorPaidAmount, totalPayment, totalPaid,
 * and currentlyDue.
 * @param setInput - setInput is a function that updates the state of the input object. It takes an
 * object as an argument and merges it with the current state of the input object. The updated input
 * object is then set as the new state.
 */
export const handleTotalPayment = (input, setInput, services) => {
    let total = 0;
    if (input.serviceStates) {
        const { serviceStates } = input;
        // Loop over each service in the `services` state
        Object.keys(services).forEach(service => {
            // If the service is selected, add its payment amount to the total
            if (services[service]) {
                console.log(serviceStates[`${service}PaymentAmount`], 'func')
                total += Number(serviceStates[`${service}PaymentAmount`]);
            }
        });

        // Use the spread operator to copy the existing input object and only update the `totalPayment` property
        setInput(prevInput => ({ ...prevInput, totalPayment: total }));
    }
};

export const handleTotalPaid = (input, setInput, services) => {
    let total = 0;

    // Loop over each service in the `services` state
    Object.keys(services).forEach(service => {
        // If the service is selected, add its paid amount to the total
        if (services[service]) {
            total += Number(input[`${service}PaidAmount`]);
        }
    });

    setInput(prevInput => ({ ...prevInput, totalPaid: total }))
};

export const handleTotalDue = (input, setInput, services) => {
    let total = 0;

    // Loop over each service in the `services` state
    Object.keys(services).forEach(service => {
        // If the service is selected, add its due amount to the total
        if (services[service]) {
            total += Number(input[`${service}PaymentAmount`]) - Number(input[`${service}PaidAmount`]);
        }
    });

    setInput(prevInput => ({ ...prevInput, currentlyDue: total }))
};
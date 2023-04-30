import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * The handleChange function updates the input state based on the name and value of the input element,
 * and calculates the due amount for different payment types.
 * @param e - The event object, which contains information about the event that triggered the function
 * (e.g. a change in an input field).
 * @param setInput - setInput is a function that updates the state of an input field or a form. It
 * takes an object as an argument and updates the state with the new values.
 */
export const handleChange = (e, setInput, key) => {
    const { name, value } = e.target;

    if (key && name.endsWith('PaidAmount')) {
        setInput(prevState => {
            const serviceTitle = key // Get the service title
            const paymentAmount = Number(prevState.serviceStates[`${serviceTitle}PaymentAmount`]);
            const paidAmount = Number(value);
            const dueAmount = paymentAmount - paidAmount;

            const updatedServiceStates = {
                ...prevState.serviceStates,
                [`${serviceTitle}PaidAmount`]: paidAmount,
                [`${serviceTitle}DueAmount`]: dueAmount
            };

            const paymentTracker = [...prevState.paymentTracker];
            const serviceIndex = paymentTracker.findIndex(
                (s) => s.service === serviceTitle
            );

            if (serviceIndex >= 0) {
                const lastPayment = paymentTracker[serviceIndex].payments[
                    paymentTracker[serviceIndex].payments.length - 1
                ];
                if (lastPayment.paidAmount !== paidAmount) {
                    paymentTracker[serviceIndex].payments.push({
                        paidAmount: paidAmount,
                        paidDate: new Date(),
                    });
                }
            } else {
                paymentTracker.push({
                    service: serviceTitle,
                    payments: [
                        {
                            paidAmount: paidAmount,
                            paidDate: new Date(),
                        },
                    ],
                });
            }


            return {
                ...prevState,
                serviceStates: updatedServiceStates,
                // paymentTracker: paymentTracker,
                currentlyDue: calculateTotalDue({ ...prevState, serviceStates: updatedServiceStates }, key, dueAmount),
            };
        });
    } else if (name.endsWith('PaymentAmount') || name.endsWith('DueAmount')) {
        const serviceTitle = name.replace(/(PaymentAmount|DueAmount)$/, '');
        const updatedServiceStates = {
            ...prevState.serviceStates,
            [name]: value
        };

        setInput(prevState => ({
            ...prevState,
            serviceStates: updatedServiceStates,
            currentlyDue: calculateTotalDue({ ...prevState, serviceStates: updatedServiceStates }, key, prevState.serviceStates[`${serviceTitle}DueAmount`])
        }));
    } else {
        setInput(prevState => ({ ...prevState, [name]: value }));
    }
};

export const calculateTotalDue = (input, key, dueAmount) => {
    const { serviceStates } = input;
    const serviceTitles = Object.keys(serviceStates);

    const totalPayment = serviceTitles.reduce((acc, title) => acc + serviceStates[title].paymentAmount, 0);
    const totalPaid = serviceTitles.reduce((acc, title) => acc + serviceStates[title].paidAmount, 0);
    const totalDue = totalPayment - totalPaid - dueAmount;

    return totalDue;
};

// PDF Generator
export const generateInvoice = (client) => {
    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Set the font type and size
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(12);

    // Add the company logo and name
    // doc.addImage('./static/images/logo/cms.png', 'PNG', 10, 10, 50, 50);
    doc.setFontSize(18);
    doc.setTextColor('#333333');
    doc.text('Company Name', 10, 10);

    // Add the company contact info
    doc.setFontSize(11);
    doc.setTextColor('#666666');
    doc.text('123 Main St', 200, 10, { align: 'right' });
    doc.text('Dhaka, Bangladesh', 200, 15, { align: 'right' });
    doc.text('Phone: 00000000000', 200, 20, { align: 'right' });
    doc.text('Email: info@company.com', 200, 25, { align: 'right' });

    // Add the client info
    doc.setFontSize(16);
    doc.setTextColor('#333333');
    doc.text('Client Info', 10, 35);
    doc.setFontSize(10);
    doc.setTextColor('#666666');
    doc.text(`Name: ${client.clientName}`, 10, 40);
    doc.text(`Phone: ${client.clientPhone}`, 10, 45);
    doc.text(`Email: ${client.clientEmail}`, 10, 50);
    doc.text(`Address: ${client.clientAddress}`, 10, 55);

    // Add the service and payment info
    doc.setFontSize(16);
    doc.setTextColor('#333333');
    doc.text('Services', 10, 70);
    doc.setFontSize(12);
    doc.setTextColor('#666666');

    // Define the table headers and rows
    const headers = ['Service', 'Payment Amount', 'Paid Amount', 'Due Amount'];
    const data = client.clientServices.map((service) => {
        const paymentAmount = client[`${service}PaymentAmount`];
        const paidAmount = client[`${service}PaidAmount`];
        const dueAmount = client[`${service}DueAmount`];
        return [service, paymentAmount, paidAmount, dueAmount];
    });

    // Generate the table using autotable plugin
    doc.autoTable({
        head: [headers],
        body: data,
        headStyles: {
            fillColor: '#f2f2f2',
            textColor: '#333333',
            fontSize: 12,
        },
        bodyStyles: {
            textColor: '#666666',
            fontSize: 10,
        },
        columnStyles: {
            0: { cellWidth: 60 },
            1: { cellWidth: 40, halign: 'left' },
            2: { cellWidth: 40, halign: 'left' },
            3: { cellWidth: 40, halign: 'left' },
        },
        margin: { top: 75 },
    });

    // Add the payment summary
    doc.setFontSize(10);
    doc.setTextColor('#666666');
    doc.text(`Total Payment: $${client.totalPayment}`, 10, doc.lastAutoTable.finalY + 10);
    doc.text(`Total Paid: $${client.totalPaid}`, 10, doc.lastAutoTable.finalY + 15);
    doc.text(`Currently Due: $${client.currentlyDue}`, 10, doc.lastAutoTable.finalY + 20);

    // Save and download the PDF
    doc.save(`Invoice_${client.clientName}.pdf`);
};
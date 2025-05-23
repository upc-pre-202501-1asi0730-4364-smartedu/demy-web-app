<script>
import { ref } from 'vue'

import StudentSearch from "../components/student-search.component.vue";
import StudentStatus from "../components/student-status.component.vue";
import PaymentRegistration from "../components/payment-registration.component.vue";

import { StudentService } from '../../enrollments/services/student.service.js'
import { InvoiceService } from '../services/invoice.service.js'
import { PaymentService } from '../services/payment.service.js'
import { PaymentStatus } from '../model/invoice.entity.js'
import { FinancialTransactionService } from '../services/financial-transaction.service.js'
import { FinancialTransaction, PartyType } from '../model/financial-transaction.entity.js'

const studentService = new StudentService()
const invoiceService = new InvoiceService()
const paymentService = new PaymentService()
const transactionService = new FinancialTransactionService()

export default {
  name: 'payments-page',
  components: {
    StudentSearch,
    StudentStatus,
    PaymentRegistration
  },
  setup() {
    const studentPaymentStatus = ref(null)
    const selectedInvoice = ref(null)
    const showPaymentForm = ref(false)

    const onSearch = async (dni) => {
      try {
        const students = await studentService.getByDni(dni)
        if (students.length > 0) {
          const student = students[0]
          const invoices = await invoiceService.getByStudentId(student.id)
          studentPaymentStatus.value = { student, invoices }
        }
      } catch (err) {
        console.error('Error en búsqueda', err)
      }
    }

    const onRegisterPaymentRequest = (invoice) => {
      selectedInvoice.value = invoice
      showPaymentForm.value = true
    }

    const onPaymentRegistered = async ({ amount, paidAt }) => {
      const invoice = selectedInvoice.value
      const status = studentPaymentStatus.value
      if (!status || !invoice) return

      const payment = {
        invoiceId: invoice.id,
        amount,
        paidAt,
        method: 'CASH'
      }

      try {
        const createdPayment = await paymentService.create(payment)

        // 🧾 Registrar transacción financiera
        const transaction = new FinancialTransaction({
          source: PartyType.STUDENT,
          target: PartyType.ACADEMY,
          type: 'INCOME',
          category: 'Pago de mensualidad',
          concept: 'Pago de mensualidad',
          date: new Date(),
          reference: `TX-${Date.now()}`,
          amount: createdPayment.amount,
          method: createdPayment.method
        })

        await transactionService.create(transaction)

        const updatedInvoice = {
          id: invoice.id,
          subscriptionId: invoice.subscriptionId,
          amount: invoice.amount,
          dueDate: invoice.dueDate,
          studentId: invoice.studentId,
          status: PaymentStatus.PAID
        }

        await invoiceService.update(invoice.id, updatedInvoice)

        studentPaymentStatus.value = {
          ...status,
          invoices: status.invoices.map((inv) =>
              inv.id === invoice.id ? { ...inv, status: PaymentStatus.PAID } : inv
          )
        }

        showPaymentForm.value = false
      } catch (err) {
        console.error('Error al registrar el pago o la transacción', err)
      }
    }

    return {
      studentPaymentStatus,
      selectedInvoice,
      showPaymentForm,
      onSearch,
      onRegisterPaymentRequest,
      onPaymentRegistered
    }
  }
}
</script>

<template>
  <div>
    <h3>{{ $t('payments.title') }}</h3>
    <p class="subtitle-2">{{ $t('payments.subtitle') }}</p>

    <student-search @search="onSearch" />

    <student-status
        v-if="studentPaymentStatus"
        :student="studentPaymentStatus.student"
        :invoices="studentPaymentStatus.invoices"
        @registerPaymentRequested="onRegisterPaymentRequest"
    />

    <payment-registration
        v-if="showPaymentForm && selectedInvoice"
        :student="studentPaymentStatus.student"
        :invoice="selectedInvoice"
        @paymentRegistered="onPaymentRegistered"
    />
  </div>
</template>

<style scoped>
h3 {
  color: var(--color-secondary-dark-1);
}

.subtitle-2 {
  font-size: 1rem;
  color: var(--color-secondary-dark-1);
  margin-bottom: 1.25rem;
}
</style>
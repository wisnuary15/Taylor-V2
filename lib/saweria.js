import qrcode from "qrcode";
import * as cheerio from "cheerio";
import moment from "moment-timezone";
import fetch from "node-fetch";
class Saweria {
  constructor(user_id) {
    this.user_id = user_id;
    this.baseUrl = "https://saweria.co";
    this.apiUrl = "https://backend.saweria.co";
  }
  async login(email, password) {
    try {
      const response = await fetch(`${this.apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });
      const {
        data
      } = await response.json();
      return data && data.id ? {
        creator: "Wudysoft",
        status: true,
        data: {
          user_id: data.id
        }
      } : {
        creator: "Wudysoft",
        status: false,
        msg: "Failed to login"
      };
    } catch (error) {
      console.log(error);
      return {
        creator: "Wudysoft",
        status: false,
        msg: error.message
      };
    }
  }
  async createPayment(amount, msg = "Order") {
    try {
      if (!this.user_id) return {
        creator: "Wudysoft",
        status: false,
        msg: "USER ID NOT FOUND"
      };
      const response = await fetch(`${this.apiUrl}/donations/${this.user_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          agree: true,
          amount: Number(amount),
          customer_info: {
            first_name: "Payment Gateway",
            email: "gateway@nomisec07.tech",
            phone: ""
          },
          message: msg,
          notUnderAge: true,
          payment_type: "qris",
          vote: ""
        })
      });
      const {
        data
      } = await response.json();
      if (!data || !data.id) return {
        creator: "Wudysoft",
        status: false,
        msg: "Failed to create payment"
      };
      const qr_string = data.qr_string;
      const qr_image = await qrcode.toDataURL(qr_string, {
        scale: 8
      });
      return {
        creator: "Wudysoft",
        status: true,
        data: {
          ...data,
          expired_at: moment(data.created_at).add(10, "minutes").format("DD/MM/YYYY HH:mm:ss"),
          receipt: `${this.baseUrl}/qris/${data.id}`,
          url: `${this.baseUrl}/qris/${data.id}`,
          qr_image: qr_image
        }
      };
    } catch (error) {
      console.log(error);
      return {
        creator: "Wudysoft",
        status: false,
        msg: error.message
      };
    }
  }
  async checkPayment(id) {
    try {
      if (!this.user_id) return {
        creator: "Wudysoft",
        status: false,
        msg: "USER ID NOT FOUND"
      };
      const response = await fetch(`${this.baseUrl}/receipt/${id}`, {
        method: "GET",
        headers: {
          Accept: "*/*"
        }
      });
      const text = await response.text();
      const msg = cheerio.load(text)("h2.chakra-heading.css-14dtuui").text();
      if (!msg) return {
        creator: "Wudysoft",
        status: false,
        msg: '❌ Transaction not found or not completed\n\nNote: Please check the transaction status by typing "check" again if you are sure you have completed the payment transaction.'
      };
      return {
        creator: "Wudysoft",
        status: msg.toLowerCase() === "berhasil",
        msg: msg.toUpperCase()
      };
    } catch (error) {
      console.log(error);
      return {
        creator: "Wudysoft",
        status: false,
        msg: error.message
      };
    }
  }
  async checkInfo() {
    try {
      if (!this.user_id) return {
        creator: "Wudysoft",
        status: false,
        msg: "USER ID NOT FOUND"
      };
      const response = await fetch(`${this.apiUrl}/users/${this.user_id}`, {
        method: "GET",
        headers: {
          Accept: "application/json"
        }
      });
      const {
        data
      } = await response.json();
      if (!data || !data.id) return {
        creator: "Wudysoft",
        status: false,
        msg: "Failed to retrieve user info"
      };
      return {
        creator: "Wudysoft",
        status: true,
        data: {
          id: data.id,
          username: data.username,
          email: data.email,
          created_at: moment(data.created_at).format("DD/MM/YYYY HH:mm:ss")
        }
      };
    } catch (error) {
      console.log(error);
      return {
        creator: "Wudysoft",
        status: false,
        msg: error.message
      };
    }
  }
  async updateUserInfo(username, email) {
    try {
      if (!this.user_id) return {
        creator: "Wudysoft",
        status: false,
        msg: "USER ID NOT FOUND"
      };
      const response = await fetch(`${this.apiUrl}/users/${this.user_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username,
          email: email
        })
      });
      const {
        data
      } = await response.json();
      if (!data || !data.id) return {
        creator: "Wudysoft",
        status: false,
        msg: "Failed to update user info"
      };
      return {
        creator: "Wudysoft",
        status: true,
        msg: "User info updated successfully",
        data: {
          id: data.id,
          username: data.username,
          email: data.email
        }
      };
    } catch (error) {
      console.log(error);
      return {
        creator: "Wudysoft",
        status: false,
        msg: error.message
      };
    }
  }
  async listDonations() {
    try {
      if (!this.user_id) return {
        creator: "Wudysoft",
        status: false,
        msg: "USER ID NOT FOUND"
      };
      const response = await fetch(`${this.apiUrl}/donations/${this.user_id}/list`, {
        method: "GET",
        headers: {
          Accept: "application/json"
        }
      });
      const {
        data
      } = await response.json();
      if (!data || data.length === 0) return {
        creator: "Wudysoft",
        status: false,
        msg: "No donations found"
      };
      return {
        creator: "Wudysoft",
        status: true,
        data: data.map(donation => ({
          id: donation.id,
          amount: donation.amount,
          message: donation.message,
          created_at: moment(donation.created_at).format("DD/MM/YYYY HH:mm:ss")
        }))
      };
    } catch (error) {
      console.log(error);
      return {
        creator: "Wudysoft",
        status: false,
        msg: error.message
      };
    }
  }
  async getDonationDetails(donation_id) {
    try {
      if (!this.user_id) return {
        creator: "Wudysoft",
        status: false,
        msg: "USER ID NOT FOUND"
      };
      const response = await fetch(`${this.apiUrl}/donations/${this.user_id}/${donation_id}`, {
        method: "GET",
        headers: {
          Accept: "application/json"
        }
      });
      const {
        data
      } = await response.json();
      if (!data || !data.id) return {
        creator: "Wudysoft",
        status: false,
        msg: "Donation not found"
      };
      return {
        creator: "Wudysoft",
        status: true,
        data: {
          id: data.id,
          amount: data.amount,
          message: data.message,
          created_at: moment(data.created_at).format("DD/MM/YYYY HH:mm:ss")
        }
      };
    } catch (error) {
      console.log(error);
      return {
        creator: "Wudysoft",
        status: false,
        msg: error.message
      };
    }
  }
  async deleteDonation(donation_id) {
    try {
      if (!this.user_id) return {
        creator: "Wudysoft",
        status: false,
        msg: "USER ID NOT FOUND"
      };
      const response = await fetch(`${this.apiUrl}/donations/${this.user_id}/${donation_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (response.status !== 204) return {
        creator: "Wudysoft",
        status: false,
        msg: "Failed to delete donation"
      };
      return {
        creator: "Wudysoft",
        status: true,
        msg: "Donation deleted successfully"
      };
    } catch (error) {
      console.log(error);
      return {
        creator: "Wudysoft",
        status: false,
        msg: error.message
      };
    }
  }
  async getUserBalance() {
    try {
      if (!this.user_id) return {
        creator: "Wudysoft",
        status: false,
        msg: "USER ID NOT FOUND"
      };
      const response = await fetch(`${this.apiUrl}/users/${this.user_id}/balance`, {
        method: "GET",
        headers: {
          Accept: "application/json"
        }
      });
      const {
        data
      } = await response.json();
      if (!data || typeof data.balance !== "number") return {
        creator: "Wudysoft",
        status: false,
        msg: "Failed to retrieve user balance"
      };
      return {
        creator: "Wudysoft",
        status: true,
        data: {
          balance: data.balance,
          updated_at: moment(data.updated_at).format("DD/MM/YYYY HH:mm:ss")
        }
      };
    } catch (error) {
      console.log(error);
      return {
        creator: "Wudysoft",
        status: false,
        msg: error.message
      };
    }
  }
}
export {
  Saweria
};
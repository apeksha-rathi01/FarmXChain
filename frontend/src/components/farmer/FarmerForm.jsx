import { useState } from "react";
import { createFarmer } from "../../api/farmerService";
import "../../styles/dashboard.css";

export default function FarmerForm() {
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!phone || !address) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      await createFarmer({ phone, address });
      alert("Farmer profile submitted successfully");
      setPhone("");
      setAddress("");
    } catch (error) {
      alert("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>Farmer Onboarding</h3>

      <label>Phone Number</label>
      <input
        placeholder="Enter phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <label>Address</label>
      <input
        placeholder="Enter address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <button onClick={submit} disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
}

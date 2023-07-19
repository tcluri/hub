import { getCookie } from "../utils";
import { useStore } from "../store";
import { createSignal, Show, For } from "solid-js";
import { genderChoices, stateChoices, occupationChoices, vaccinationChoices } from "../constants";
import RegistrationSuccess from "./RegistrationSuccess";

const RegistrationForm = () => {
  const csrftoken = getCookie("csrftoken");

  // Form signals
  const [firstName, setFirstName] = createSignal("");
  const [lastName, setLastName] = createSignal("");
  const [dateOfBirth, setDateOfBirth] = createSignal("");
  const [phone, setPhone] = createSignal("");
  const [upaiProfile, setUpaiProfile] = createSignal("");
  const [teamName, setTeamName] = createSignal("");
  const [occupation, setOccupation] = createSignal("");
  const [educationInstitution, setEducationInstitution] = createSignal("");
  const [gender, setGender] = createSignal("");
  const [otherGender, setOtherGender] = createSignal("");
  const [notInIndia, setNotInIndia] = createSignal(false);
  const [city, setCity] = createSignal("");
  const [state, setState] = createSignal("");
  const [isVaccinated, setIsVaccinated] = createSignal(false);
  const [vaccinationName, setVaccinationName] = createSignal("");
  const [vaccinationCertficate, setVaccinationCertificate] = createSignal(null);
  const [notVaccinatedExplanation, setNotVaccinatedExplanation] = createSignal("");
  //UI signals
  const [error, setError] = createSignal("");
  const [player, setPlayer] = createSignal();

  const [_, { setPlayerById }] = useStore();

  // Gender
  const handleGenderChange = e => {
    setGender(e.target.value);
    if (e.target.value !== "O") {
      setOtherGender("");
    }
  };

  // Not in India checkbox
  const handleNotInIndiaChange = () => {
    setNotInIndia(!notInIndia());
    setState("");
  };

  // Is vaccinated checkbox
  const handleIsVaccinatedChange = e => {
    setIsVaccinated(!isVaccinated());
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setVaccinationCertificate(file);
  }

  const handleSubmit = e => {
    e.preventDefault();
    // Prepare the data to be submitted
    const formData = {
      first_name: firstName(),
      last_name: lastName(),
      date_of_birth: dateOfBirth(),
      gender: gender(),
      other_gender: otherGender(),
      city: city(),
      phone: phone(),
      state_ut: state(),
      not_in_india: notInIndia(),
      team_name: teamName(),
      occupation: occupation(),
      educational_institution: educationInstitution(),
      india_ultimate_profile: upaiProfile(),
    };
    // Perform form submission logic or API request with formData
    console.log("Form submitted with data:", formData);

    const vaccinationData = {
      player: player(),
      is_vaccinated: isVaccinated(),
      vaccination_name: vaccinationName(),
      vaccination_certificate: vaccinationCertficate(),
      explain_not_vaccinated: notVaccinatedExplanation(),
    };

    console.log("Vaccination data:", vaccinationData);

    try {
        submitFormData(formData, vaccinationData);
    } catch (error) {
      setError('An error occured: ${error}');
    }
    // submitVaccinationData(vaccinationData);
  };

  const submitVaccinationData = async vaccinationData => {
    try {
      const vaccinationFormData = new FormData();
      vaccinationFormData.append("player", vaccinationData.player);
      vaccinationFormData.append("is_vaccinated", vaccinationData.is_vaccinated);
      vaccinationFormData.append("vaccination_name", vaccinationData.vaccination_name);
      vaccinationFormData.append("vaccination_certificate", vaccinationData.vaccination_certificate);
      vaccinationFormData.append("explain_not_vaccinated", vaccinationData.explain_not_vaccinated);

      const response = await fetch("/api/vaccination", {
        method: "POST",
        headers: {
          "X-CSRFToken": getCookie("csrftoken")
        },
        body: vaccinationFormData
      });

      if (response.ok) {
        console.log("Vaccination data submitted successfully");
      } else {
        console.error("Error submitting vaccination data");
      }
    } catch (error) {
      console.error("An error occured while submitting vaccination data:", error);
    }
  };

  const submitFormData = async (formData, vaccinationData) => {
    // Send a post request to the api
    try {
      const response = await fetch("/api/registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        console.log("Player created successfully");
        const player = await response.json();
        setPlayer(player);
        setPlayerById(player);
        // Submit vaccination data
        submitVaccinationData(vaccinationData);
      } else {
        if (response.status == 400) {
          const error = await response.json();
          setError(error.message);
        } else {
          setError(
            `Server returned an error: ${response.statusText} (${
              response.status
            })`
          );
        }
      }
    } catch (error) {
      setError(`An error occurred: ${error}`);
    }
  };

  return (
    <div>
      <Show
        when={!player()}
        fallback={<RegistrationSuccess player={player()} />}
      >
        <form onSubmit={handleSubmit}>
          <div class="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label
                for="first_name"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                First name
              </label>
              <input
                type="text"
                id="first_name"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="John"
                value={firstName()}
                onInput={e => setFirstName(e.currentTarget.value)}
                required
              />
            </div>
            <div>
              <label
                for="last_name"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Last name
              </label>
              <input
                type="text"
                id="last_name"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Doe"
                value={lastName()}
                onInput={e => setLastName(e.currentTarget.value)}
                required
              />
            </div>
            <div>
              <label
                for="dateofbirth"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Date of Birth
              </label>
              <input
                type="date"
                id="dateofbirth"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Select date"
                value={dateOfBirth()}
                onInput={e => setDateOfBirth(e.currentTarget.value)}
                required
              />
            </div>
            <div>
              <label
                for="phone"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Phone number
              </label>
              <input
                type="tel"
                id="phone"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="9999999999"
                value={phone()}
                onInput={e => setPhone(e.currentTarget.value)}
              />
            </div>
            <div>
              <label
                for="upai-profile"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                India Ultimate Profile URL
              </label>
              <input
                type="url"
                id="upai-profile"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="https://indiaultimate.org/en-in/u/player-name"
                value={upaiProfile()}
                onInput={e => setUpaiProfile(e.currentTarget.value)}
              />
            </div>
            <div>
              <label
                for="team-name"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Team Name
              </label>
              <input
                type="text"
                id="team-name"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder=""
                value={teamName()}
                onInput={e => setTeamName(e.currentTarget.value)}
              />
            </div>
            <div>
              <label
                for="occupation"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Occupation
              </label>
              <select
                id="occupation"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={occupation()}
                onInput={e => setOccupation(e.currentTarget.value)}
                required
              >
                <option value="" disabled>
                  Select Occupation
                </option>
                <For each={occupationChoices}>
                   {choice => (
                    <option value={choice.value}>{choice.label}</option>
                  )}
                </For>
              </select>
            </div>
            <div>
              <label
                for="education-institution"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Education Institution
              </label>
              <input
                type="text"
                id="education-institution"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder=""
                value={educationInstitution()}
                onInput={e => setEducationInstitution(e.currentTarget.value)}
              />
            </div>
            <div>
              <label
                for="gender"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Gender
              </label>
              <select
                id="gender"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={gender()}
                onInput={handleGenderChange}
                required
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <For each={genderChoices}>
                  {choice => (
                    <option value={choice.value}>{choice.label}</option>
                  )}
                </For>
              </select>
            </div>
            <div>
              <Show when={gender() === "O"}>
                <label
                  for="other-gender"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Other Gender:
                </label>
                <input
                  id="other-gender"
                  type="text"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={otherGender()}
                  onInput={e => setOtherGender(e.target.value)}
                  required
                />
              </Show>
            </div>
            <div>
              <div class="flex items-center pl-4 border border-gray-200 rounded dark:border-gray-700">
                <input
                  id="not-in-india"
                  type="checkbox"
                  checked={notInIndia()}
                  onChange={handleNotInIndiaChange}
                  value={notInIndia()}
                  name="bordered-checkbox"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  for="not-in-india"
                  class="w-full py-4 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  I'm not in India
                </label>
              </div>
            </div>
            <div />
            <div>
              <label
                for="city-name"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                City
              </label>
              <input
                type="text"
                id="city-name"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={city()}
                onInput={e => setCity(e.target.value)}
                placeholder=""
              />
            </div>
            {/* State dropdown */}
            <div>
              <Show when={!notInIndia()}>
                <div>
                  <label
                    for="state"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    State
                  </label>
                  <select
                    id="state"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={state()}
                    onInput={e => setState(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Select State/UT
                    </option>
                    <For each={stateChoices}>
                      {choice => (
                        <option value={choice.value}>{choice.label}</option>
                      )}
                    </For>
                  </select>
                </div>
              </Show>
            </div>
            <div>
              <div class="flex items-center pl-4 border border-gray-200 rounded dark:border-gray-700">
                <input
                  id="is-vaccinated"
                  type="checkbox"
                  checked={isVaccinated()}
                  onChange={handleIsVaccinatedChange}
                  value={isVaccinated()}
                  name="bordered-checkbox"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  for="is-vaccinated"
                  class="w-full py-4 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Vaccinated
                </label>
              </div>
            </div>
            <div />
             {/* Vaccination dropdown */}
            <div>
              <Show when={isVaccinated()}>
                <div>
                  <label
                    for="vaccination-name"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Vaccination Name
                  </label>
                  <select
                    id="vaccination-name"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={vaccinationName()}
                    onInput={e => setVaccinationName(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Select Vaccination Name
                    </option>
                    <For each={vaccinationChoices}>
                      {choice => (
                        <option value={choice.value}>{choice.label}</option>
                      )}
                    </For>
                  </select>
                </div>
              </Show>
            </div>
            <div>
              <Show when={isVaccinated()}>
                <div>
                  <label
                    for="vaccination-certificate"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >Vaccination Certificate
                  </label>
                  <input
                    id="vaccination-certificate"
                    class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    onInput={handleFileChange}
                    type="file"
                    aria-describedby="file_input_help"
                    required
                  />
                  <p
                    class="mt-1 text-sm text-gray-500 dark:text-gray-300"
                    id="file_input_help">PNG, JPG or PDF.</p>
                </div>
              </Show>
            </div>
            <div>
              <Show when={!isVaccinated()}>
                <label
                  for="not-vaccinated-explanation"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Explain not being vaccinated</label>
                <textarea
                  id="not-vaccinated-explanation"
                  value={notVaccinatedExplanation()}
                  onInput={e => setNotVaccinatedExplanation(e.target.value)}
                  rows="4"
                  class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your explanation on why you are not vaccinated..."
                  required
                >
                </textarea>
              </Show>
            </div>
          </div>
          <Show when={error()}>
            <p class="my-2 text-sm text-red-600 dark:text-red-500">
              <span class="font-medium">Oops!</span> {error()}
            </p>
          </Show>
          <button
            type="submit"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Submit
          </button>
        </form>
      </Show>
    </div>
  );
};

export default RegistrationForm;

const forgotPasswordTemplate = (name, link) => {

    return `

    <div style="font-family:Arial;padding:30px">

        <h2>Hello ${name}</h2>

        <p>

        We received a request to reset your password.

        </p>

        <p>

        Click below button.

        </p>

        <a
        href="${link}"

        style="

        display:inline-block;

        padding:12px 22px;

        background:black;

        color:white;

        text-decoration:none;

        border-radius:6px;

        ">

        Reset Password

        </a>

        <br><br>

        <small>

        This link expires in 15 minutes.

        </small>

    </div>

    `;
};

module.exports = forgotPasswordTemplate;
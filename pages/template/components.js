
export default class Components {
  template_add_params = `
   <div class="container_params_add">

      <p class="text_p"> parâmetro: </p>

      <%- id_input_key %>

      <p class="text_p"> valor: </p>

      <%- id_input_property %>

      <style>
         .container_params_add {
            width: 100%;
            background-color: #6C63FF;
            display: flex;
            align-items: center;
            margin: 5px 0px
         }

         .text_p{
            margin: 0px 5px;
            color: #fff;
            font-size: 1rem;
            font-weight: 800;
         }
      </style>

   </div>
`;
}

using Qualitas_Backend.Models;
using Qualitas_Backend.Requests;
using Qualitas_Backend.Responses;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;

namespace Qualitas_Backend.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class LoginController : ApiController
    {
        private QualitasEntities db = new QualitasEntities();

        [HttpGet]
        [Route("api/login")]
        [ResponseType(typeof(LoginResponse))]
        public async Task<IHttpActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var user = await db.Users.FirstAsync(temp => temp.username == request.username && temp.password == request.password);
                var response = new LoginResponse
                {
                    Id = user.id,
                    firstname = user.firstname,
                    lastname = user.lastname,
                    role = user.RoleType,
                    username = user.username
                };
                return Ok(response);
            }
            catch (Exception e)
            {
                return NotFound();
            } 
        }
    }
}

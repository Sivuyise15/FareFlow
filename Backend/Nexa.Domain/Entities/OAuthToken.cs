using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nexa.Domain.Entities
{
    public class OAuthToken
    {
        public string accessToken { get; set; }
        public string refreshToken { get; set; }
        public int expiry { get; set; }
    }
}

using System;


namespace dotnetapp.Exceptions
{
    public class LoanException : Exception
    {
        public LoanException() 
        {}

        public LoanException(string message) : base(message)
        {}
    }
}